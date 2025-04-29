// TODO: change fontsize to make it responsive

import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Flex, Box, Input, Button, VStack, HStack, Stack, Text, SimpleGrid, Select } from "@chakra-ui/react";
import ResponseBubble from './components/ResponseBubble';
import {Portal } from "@chakra-ui/react"
// import { Button } from "@chakra-ui/react"
import Sidebar from './components/Sidebar';
import { Menu } from "@chakra-ui/react";
import QueryBox from './components/QueryBox';
import QuestionBubble from './components/QuestionBubble';
import PromptButtons from './components/PromptButtons';
import { Link } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Tooltip } from "./components/ui/tooltip.jsx"
import { LuInfo } from "react-icons/lu"


const Chatbot = () => {

  const [queries, setQueries] = useState([])
  const [contexts, setContexts] = useState([])
  const [responses, setResponses] = useState([])
  const [files, setFiles] = useState([])
  const [showFiles, setShowFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [allMessages, setAllMessages] = useState([])

  const lastUserMessageRef = useRef(null);

  const breakpoints = {
    sm: "800px",
    md: "1300px",
    lg: "1700px",
  }

  const handleSend = async (input) => {
    if (input.trim() && isLoading === false) {
      try {
        setIsLoading(true);
        const messagesBeforeSending = [
          ...allMessages,
          { text: input, sender: "user" },
          { text: "", sender: "bot" }
        ];
        setAllMessages(messagesBeforeSending);
        
        const res = await axios.post('https://pronova-llm-1-c672684149ef.herokuapp.com/query', {
          // const res = await axios.post('http://127.0.0.1:5000/query', {
            new_query: input,
            queries: queries,
            contexts: contexts,
            responses: responses,
            files: files
          });
          //console.log('Response:', res.data);
          setQueries(res.data.queries);
          setContexts(res.data.contexts);
          setResponses(res.data.responses);
          setFiles(res.data.files || []);
          console.log('files:', res.data.files)
          const flattenedFiles = res.data.files.flat();
          setFiles(flattenedFiles);
  
          setAllMessages((prevMessages) => {
            let updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].text = res.data.responses[res.data.responses.length - 1];
            return updatedMessages;
          });
  
      } catch (error) {
        console.error('Error querying the LLM:', error);
        setAllMessages((prevMessages) => {
          let updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].text = "Error querying the LLM";
          return updatedMessages;
        });

      } finally {
        setIsLoading(false);
        setAllMessages((prevMessages) => prevMessages);
      }
    }
  };

  // Auto-scroll to the latest user message
  useEffect(() => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [allMessages]);

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden" >
      {/* Header (always visible) */}
      <Box
        width="100%"
        mb="50px" //change this based on screen size
        backgroundColor="gray.900" // Dark theme
        padding="1% 2%"
        color="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="sticky"
        top="0"
        zIndex="10"
        boxShadow="md"
      >
        {/* Chatbot Name */}
        <HStack>
          <Image 
            src="/MoxAI_Logo.jpg" 
            alt="Mox AI" 
            height={{ base: "40px", md: "70px" }} // Smaller on mobile
          />
          {/* tooltip disclaimer */}
          <Tooltip content="Disclaimer: MoxAI is in beta development and should not be used as a substitute for professional veterinary advice. Please consult your veterinarian for any urgent health concerns.">
            <Button size={{ base: "sm", md: "md" }} variant="ghost">
              <LuInfo />
            </Button>
          </Tooltip>
        </HStack>

        {/* Clickable Pronova Logo */}
        <Link href="https://pronovapets.com/" isExternal>
          <Image 
            src="/pronovaTextLogo.png" 
            alt="DogVet AI Logo" 
            height={{ base: "20px", md: "40px" }} // Smaller on mobile
            cursor="pointer"
          />
        </Link>

        {/* Dropdown menu */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size={{ base: "xs", md: "sm" }}> {/* Smaller on mobile */}
              Relevant Files
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {files.map((file, index) => (
                  <Menu.Item key={index}>
                    <Link href={file} isExternal>
                      {file}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
      <Box
        width="100%"
        backgroundColor="black.500"
        // paddingTop="50px"
        paddingTop="4%"
        // color="white"
        color="gray.500" // A good light grey color

        textAlign="center"
        position="sticky"
        top="0"
        display={allMessages.length === 0 ? "block" : "none"}
      >
        {/* <Text fontSize="70px" fontWeight="bold">How Can I Help You Today?</Text> */}
        {/* <Text fontSize="6xl" fontWeight="bold">How Can I Help You Today?</Text> */}
        <Text fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }} fontWeight="bold">How Can I Help You Today!</Text>
      </Box>

      {/* /* Name, age, and Breed Prompt */}
        <Box
            width="100%"
            backgroundColor="black.500"
            padding="0.75%"
            marginBottom="3%"
            color="gray.500" // A good light grey color
            textAlign="center"
            position="sticky"
            top="0"
            display={allMessages.length === 0 ? "block" : "none"}
          >
            {/* <Text fontSize="20px" fontWeight="bold">For more personalized feedback, please begin by providing your dog's name, age, and breed</Text> */}
            {/* <Text fontSize="xl" fontWeight="bold">For more personalized feedback, please begin by providing your dog's name, age, and breed</Text> */}
            <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }} fontWeight="bold">For more personalized feedback, please begin by providing your dog's name, age, and breed</Text>
        </Box>

      {/* Prewritten Example questions */}
      <Box
          width="100%"
          backgroundColor="black.500"
          // padding="50px"
          padding="0% 4% 4% 4%"
          color="white"
          textAlign="center"
          justifyContent="center"
          top="0"
          display={allMessages.length === 0 ? "flex" : "none"}
        >
          <PromptButtons onPromptSelect={handleSend}></PromptButtons>
      </Box>
          

      {/* Scrollable message container */}
      <Flex flex="1" width={{ sm: "95vw", md: "70vw", lg: "45vw" }} margin="auto" justifyContent="center" overflow="hidden" display={allMessages.length === 0 ? "none" : "block"}>
        <Box width="100%" height="100%" overflowY="auto">
          <SimpleGrid columns={9} gap="10px">
        {allMessages.map((msg, idx) => (
          <React.Fragment key={idx}>
            {msg.sender === "user" ? (
          <>
            <Box gridColumn="span 3"  />
            <Box gridColumn="span 6" display="flex" justifyContent="flex-end" ref={idx === allMessages.length - 2 ? lastUserMessageRef : null}>
              <QuestionBubble content={msg.text} />
            </Box>
          </>
            ) : (
          <>
            <Box gridColumn={{ base: "span 8", md: "span 7" }} display="flex" justifyContent="flex-start">
              <ResponseBubble content={msg.text} />
            </Box>
            <Box gridColumn="span 2" />
          </>
            )}
          </React.Fragment>
        ))}
        <Box gridColumn="span 9" height="64vh" />
          </SimpleGrid>
        </Box>
      </Flex>

      {/* Query Input Box (always visible) */}
      {/* <Box
        width="33%"
        position="fixed"
        bottom="50px"  // Adjust this value as needed
        left="50%"
        transform="translateX(-50%)"
        padding="20px"
      > */}
        {/* <QueryBox onQuerySubmit={handleSend} viewHeight={allMessages.length === 0 ? "40vh" : "0vh"}/> */}
        <QueryBox onQuerySubmit={handleSend} viewHeight={allMessages.length === 0 ? "auto" : "0vh"}/>
      {/* </Box> */}

    </Box>
  );
};

export default Chatbot;