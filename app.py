#!/usr/bin/env python
# coding: utf-8

# # Pronova LLM Run Model #
# ## Use this notebook to do the following ##
# - Run the current model on a query
# - start a flask api server that accepts a query and will return a response

# In[ ]:


# Load require libraries
import os
from qdrant_client import QdrantClient # type: ignore
from openai import OpenAI # type: ignore
from dotenv import load_dotenv # type: ignore
from IPython.display import Markdown, display

# Load environment variables from .env file
load_dotenv()


# ### Setup Qdrant connection ###

# In[ ]:


# Get the Qdrant API key from the environment variable
Qdrant_api_key = os.getenv('Qdrant_API_KEY')
if not Qdrant_api_key:
    raise ValueError("No Qdrant API key found in environment variables")
Qdrant_url = os.getenv('Qdrant_URL')
if not Qdrant_url:
    raise ValueError("No Qdrant URL found in environment variables")


# Initialize Qdrant client
try:
    Qclient = QdrantClient(
        url= Qdrant_url,
        check_compatibility=False,
        api_key=Qdrant_api_key
    )
    print("Successfully connected to Qdrant")
except Exception as e:
    print(f"Failed to connect to Qdrant: {e}")
    raise


# ### Setup OpenAI connection ###

# In[ ]:


# Get the OpenAI API key from the environment variable
OpenAI_api_key = os.getenv('OPENAI_API_KEY')
if not OpenAI_api_key:
    raise ValueError("No OpenAI API key found in environment variables")

OpenAI.api_key = OpenAI_api_key


# ### Get an OpenAI embedding from a text segment (Function) ###

# In[ ]:


# Function to get the embedding of a text
def get_embedding(text):
    client = OpenAI()
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding


# ### Retrieve similar chunks from query (Function) ###

# In[ ]:



def retrieve_relevant_chunks(collection_name, query, top_k=5, threshold=0.80):
    query_embedding = get_embedding(query)
    
    search_result = Qclient.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=top_k
    )

    # Filter results based on threshold
    filtered_results = [
        result for result in search_result if result.score >= threshold
    ]
    
    contexts = [result.payload["text"] for result in filtered_results]
    # files = [result.payload.get("source_file") for result in filtered_results]
    urls = [result.payload.get("url") for result in filtered_results]

    # get rid of url that don't have a url:
    # this is bc the url has the wrong ' , and upserting didn't work
    # the context is still valid, but we just wont put the url for now
    # urls = [url for url in urls if url is not "URL not found"]
    return contexts, urls





# ### Rank response source importance (Function) ###

# In[ ]:


from collections import Counter

def file_ratios(files):
    total_files = len(files)
    counts = Counter(files)
    return {file: count*100 / total_files for file, count in counts.items()}


# file_ratios(["a", "a", "b", "c"])
# {'a': 0.5, 'b': 0.25, 'c': 0.25}


# ### Markdown Print Function ###

# In[ ]:


def print_markdown(md_text):
    display(Markdown(md_text))


# ### Generate Response from Query (Function) ###

# In[ ]:


import numpy as np

def generate_response(collection_name, query, all_query, all_context, all_responses, all_files):
    print("Generating response for query:", query)
    # generate context for new query
    context, files = retrieve_relevant_chunks(collection_name, query)
 
    if "URL not found" in files:
        print("URL not found in files, removing it")
        # remove the URL not found from the list of files
        files.remove("URL not found")
    # print("Adding new files: ", files)
    # files_used = np.unique(files).tolist()
    # files_used = file_ratios(files_used)

    system_role = "You are a specialized assistant from PronovaPets, a company that provides advice on dog-related veterinary care. If a user asks about any other animal or topic outside of dog health and the company products, politely decline to answer and remind them that you only provide information about dogs and the company. You can ask the user for more information about their dog if you think it will help come up with a more accurate answer."
    # Combine retrieved chunks into a single string
    context_text = "\n".join(context)

    # append query and context to the running lists
    all_query.append(query)
    all_context.append(context_text)
    # all_files.extend(files_used)    
    if files:
        print("Adding new files: ", files)
        all_files.extend(files)

    # get rid of repeats
    all_files = list(set(all_files))

    print("Total files used now:", all_files)
    # create the messages object using all the queries and contexts
    messages = [{"role": "system", "content": system_role}]

    for i in range(len(all_query)):
        messages.append({"role": "system", "content": "Use this context to answer my following question: " + all_context[i]})
        messages.append({"role": "user", "content": all_query[i]})
        if i < len(all_responses):
            messages.append({"role": "system", "content": all_responses[i]})
    
    # print(messages)


    # Generate a response using GPT-4
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=messages
    )
    all_responses.append(completion.choices[0].message.content)
    return all_query, all_context, all_responses, all_files


# ### Playground (use this to test querys in the notebook)

# In[ ]:


# collection_name = "LLM_V1"
# query = "After we walk, my dog is always itchy"
# response, file_rank = generate_response(collection_name, query)
# print_markdown(response.content)


# print("files used: \n")
# for file in file_rank:
#     print(f"{file}, {file_rank[file]} %")


# ### Lightweight Flask Server (for Frontend API testing) ###

# In[ ]:


# import json

# def get_citation(filename):
#     files_list = ["scrapingDemo/sources_petMD_allergies.json", "scrapingDemo/sources_petMD_behavior.json", "scrapingDemo/sources_petMD_nutrition.json", "scrapingDemo/sources_petMD_care_healthy_living.json", "scrapingDemo/sources_petMD_procedures.json", "scrapingDemo/sources_petMD_symptoms.json", "scrapingDemo/sources_petMD.json"]
#     citation = {}
    
#     for file in files_list:
#         with open(file, 'r', encoding='utf-8') as f:
#             sources = json.load(f)
#             if filename in sources:
#                 citation = sources[filename]
#                 break
    
#     url = citation.get('URL', 'URL not found')
#     author = citation.get('Author', 'Author not found')
#     date = citation.get('Date', 'Date not found')
#     topic = citation.get('Topic', 'Topic not found')
    
    
#     return topic, url, author, date

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, send_from_directory



# app = Flask(__name__)

## idk bruh

# app = Flask(__name__)

# app = Flask(__name__, static_folder="LLM_Proof_Of_Concept/dist", static_url_path="")
app = Flask(__name__, static_folder="frontend_V1/dist", static_url_path="")


CORS(app)  # This will enable CORS for all routes

# @app.route("/") 
# def index():
#     return render_template("chat.html", text="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


# def home(): 
#     return "Hello, World!"

@app.route('/query', methods=['POST'])
def query_llm():

    data = request.json
    print(data)

    new_query = data.get('new_query')
    queries = data.get('queries')
    contexts = data.get('contexts')
    responses = data.get('responses')
    files = data.get('files')
    # collection_name = "pronova-start"
    # collection_name = "pronova-petMD"
    collection_name = "FullModel"

    # maybe have a check if the collection name is in Qclient.collections
    
    # if not new_query or not queries or not contexts or not responses:
    #     return jsonify({'error': 'New query, queries, contexts, and responses must be provided'}), 400

    try:
        updated_queries, updated_contexts, updated_responses, updated_files = generate_response(collection_name, new_query, queries, contexts, responses, files)
        # print(updated_files)
        print("is this on?")
        data = {
            'queries': updated_queries,
            'contexts': updated_contexts,
            'responses': updated_responses,
            'files': updated_files.tolist() if isinstance(updated_files, np.ndarray) else updated_files
        }
        print("Response data:", data)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# # if __name__ == '__main__':
# print("Starting da server")
# port = int(os.environ.get('PORT', 5000))
# # app.run(host='0.0.0.0')

# app.run(host='0.0.0.0', port=port)



if __name__ == '__main__':
    print("Starting the server")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)