# CS Capstone 2024-2025: Veterinary-Trained LLM for Dog Care - Team Robins Egg Blue

**Team Members:** Eyal, Adam, Kelly, Iris

## Contents

* [Goal of the Project](#goal-of-the-project)
* [Sponsor Background](#sponsor-background)
* [Project Background](#project-background)
* [Problem to be Solved](#problem-to-be-solved)
* [Key Challenges](#key-challenges)
* [Proof of Concept and MVP](#proof-of-concept-and-mvp)
* [Criteria for Success](#criteria-for-success)
* [Tech Stack](#tech-stack)
* [Proposed Approach](#proposed-approach)
* [Ethics & Social Impact](#ethics--social-impact)
* [Testing Plan](#testing-plan)

## Goal of the Project

The goal of this project is to develop a veterinary-trained Large Language Model (LLM) that provides reliable and personalized advice on daily dog care. The LLM will offer expert recommendations on topics such as diet, exercise, symptom identification, and health advice, and will be deployed as a chatbot integrated into a web and native app. It will also integrate the users’ pet information directly into the LLM to provide specialized advice for their dog. The system aims to enhance pet owners’ ability to care for their dogs by giving access to credible, veterinarian-backed information.

## Sponsor Background

Our sponsor is PRONOVA, a company dedicated to revolutionizing pet healthcare through the development of advanced, non-invasive health solutions. Their mission is to empower pet owners by providing them with the tools and knowledge they need to ensure their pets’ well-being. At the heart of their innovation is the Kora Strip, a biosensor designed to analyze a pet’s saliva and monitor vital health markers. This technology offers pet owners real-time insights into their pet's health, enabling early detection of potential issues and fostering a proactive approach to pet care. PRONOVA is setting a new standard in pet healthcare, making it easier for pet owners to provide the best possible care for their companions.

## Project Background

Many dog owners rely on information found online to care for their pets, but the vast majority of these sources are written by individual pet owners or non-experts. This can make it difficult to find reliable, veterinarian-backed information on daily care, exercise routines, symptom management, and breed-specific needs. By training an LLM on reputable veterinary sources such as textbooks, peer-reviewed articles, and clinical guidelines, the project aims to address this gap, providing dog owners with easy access to accurate, expert advice through a chatbot that uses the dog’s health history for personalized recommendations.

## Problem to be Solved

The lack of access to reliable, veterinary-backed information can result in suboptimal care and potentially harm a pet’s health. The business opportunity here is to create an intelligent chatbot that serves as a digital companion, offering credible, veterinary-level guidance based on the individual dog’s health history. This would fill a significant gap in the market for authoritative pet care tools and improve user satisfaction with PRONOVA’s web app.

## Key Challenges

One of the biggest challenges we will face is getting access to high-quality and accurate data concerning all dog breeds to train our LLM on. We need access to many veterinary textbooks and may face legal and copyright issues. We will need to filter this data, construct the LLM, pre-train the model, evaluate its training, and constantly monitor and fine-tune it for each specific task, ensuring fairness. This will require many different algorithms, which will need to be researched, as certain algorithms are suited for different tasks in an LLM.

## Proof of Concept and MVP

We will train our own LLM to communicate with users about their pet-related inquiries, including health concerns and general advice for all dog breeds. We must identify and scrape websites, textbooks, and other resources to train our model, establishing it as a reliable tool for users. A stretch goal is for the model to access a database with the profile of a given pet, providing more detailed, specific responses. Lastly, we discussed integrating the system as a web application accessible from an app or website.
The LLM will also have a web interface for users to easily interact with it.
Out of Scope: diagnostic medical advice (e.g., diagnosing illnesses), non-dog species or pets.

## Criteria for Success

A key component of our mission is to create a trustworthy and reliable model trained on accurate content. A large issue with popular LLMs is their tendency to "hallucinate," generating seemingly credible but incorrect responses. Our goal is to consistently provide responses accepted by users, mirroring the advice they’d hear from a professional. Success will also be measured by the clarity of output responses and the model’s ability to understand input as a Natural Language Processor. Additionally, the model should respond to questions across various domains, including breed-specific needs, severity of sickness, and lifestyle advice for keeping pets healthy.

## Tech Stack

PRONOVA’s current tech stack includes Node.js for the front end and Rust for the back end. For our web app, we will use Python and its libraries to build the LLM. We are using OpenAI’s API to chunk our documents and generate embeddings from them, and store these embeddings in a vector database called Qdrant. To host our web app, we are looking into Vercel or Heroku for multiple users to be able to use our app, and we are using React, a Javascript framework, for the front end, ensuring users can interact smoothly with the LLM. We are using either Flask or Django for the back end to connect endpoints to Qdrant and return the chat history, and are considering the use of databases to store users’ chat history.

## Proposed Approach

The solution to this problem involves fine-tuning an existing model to meet the sponsor's needs. Our initial proposed approach is to use OpenAI’s GPT-4o-mini model and fine-tune it on hundreds of veterinary-certified question/answer prompts. Fine-tuning a model requires creating a large file filled with question/answer pairs and feeding them into the existing model so that it can adjust its biases and weights. We can also use prompt engineering to ensure that the final model only responds to questions related to dog health. This can be done by providing the model with a “system role,” such as:

"You are a specialized assistant that only provides advice on dog-related veterinary care. If a user asks about any other animal or a topic outside of dog health, politely decline to answer and remind them that you only provide information about dogs."

During initial testing with ChatGPT (which uses GPT-4o), this system role prompt yielded excellent results in keeping the model focused on the task. The first step will be to process articles from PetMD into question/answer pairs and store them in a JSON file. Next, the file can be uploaded to the fine-tuning dashboard on OpenAI’s developer portal. Once the model is fine-tuned (which could take a significant amount of time depending on the size of the input), we can use the portal’s playground to test the model on a variety of dog health questions. After evaluating the performance and determining it is satisfactory, we can proceed with creating a user interface for the chatbot. OpenAI provides an API that we can use to fetch answers from our model using typical REST methods.
Our plan is to use React.js to create an interactive web interface (similar to ChatGPT and Gemini) so that early users can test our chatbot. If this is successful, the final goal will be to integrate the chatbot into Pronova’s existing application.
There is a small cost associated with this approach. Fine-tuning a model and making calls to OpenAI’s API incurs fees. The cost is $0.15 per 1 million input tokens and $0.60 per 1 million output tokens. The fine-tuning cost is $0.30 per 1 million tokens. For reference, 1 million tokens are equivalent to approximately 750,000 words. These costs are manageable for training and testing the model. If the sponsor wishes to deploy the LLM model in the app, they will need to pay for input and output tokens based on consumer usage. We have discussed these costs with the sponsor, and they agree that the pricing is reasonable. Lastly, if the sponsor wishes to upgrade to a newer model in the future, the fine-tuning and deployment process can be easily repeated with the data we will have gathered. The only potential difference may be pricing, as newer models are typically more expensive.

## Ethics & Social Impact 
As a LLM, this chatbot is being built with the intention of delivering accurate advice based upon credible training sources. Through our training methodology, we intend to avoid possible conflicting knowledge bases and unvalidated resources to prevent model hallucination. The context used to craft each answer will contain their sources. This way, our application can become a reliable tool that pet owners can trust.
It is important for our application to communicate its role as an advisory assistant for pet owners, rather than a medically trained vet. For this reason, users will be told when certain questions necessitate a professional consultation. The model will also inform the user that it is specifically configured to answer questions and concerns in the domain of pet health and care, avoiding extraneous questions. 
Lastly, integration with the PRONOVA website and user profiles will require identification to avoid the exposure of personal data. The intricacies of this will be discussed with the PRONOVA technical team.
	
## Testing Plan
A well-trained chatbot will be assessed on the accuracy and clarity of its responses. In order to determine the model’s ability to respond to ambiguous and sensitive questions, we will consult our sponsor to develop edge cases. This will include specifically focused topics, emergency situations, and ethical questions. The model’s response will then be compared against a general-purpose model, like ChatGPT or Gemini, and evaluated by the team and sponsor. 
Additional prompt engineering will be considered once the initial launch phase reveals any necessary adjustments in terms of the response’s level of detail or consistency. We will also monitor and establish what sort of inquiries should result in a professional consultation. 
A feedback form will be administered to initial users, who can deliver written feedback on the application, including its frontend functionality and navigability. In the future, integration testing with the PRONOVA website will occur, in addition to stress-testing the amount of inquiries and users prompting the model.  
