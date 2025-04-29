import React, { useState, useEffect, useCallback } from "react";
import { HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

const prompts = [
    "My dog is panting a lot, is that normal?",
    "How often should I feed my puppy?",
    "Why is my dog chewing on everything?",
    "What are signs of fleas?",
    "How do I stop my dog from barking?",
    "What's the best dog food for sensitive stomachs?",
    "My dog is limping, what should I do?",
    "How do I train my dog to sit?",
    "What are common dog allergies?",
    "How much exercise does my dog need?",
    "Why is my dog eating grass?",
    "What are the signs of dehydration in dogs?",
    "How often should I bathe my dog?",
    "My dog is scared of thunderstorms, what can I do?",
    "What are the symptoms of kennel cough?",
    "How do I trim my dog's nails?",
    "What are the best toys for a teething puppy?",
    "My dog is growling at strangers, why?",
    "How do I know if my dog is overweight?",
    "What are the basic vaccinations my dog needs?",
    "How do I clean my dog's ears?",
    "Why does my dog have bad breath?",
    "What should I do if my dog eats chocolate?",
    "How do I stop my dog from digging?",
    "Why is my dog scratching so much?",
    "How do I socialize my dog with other dogs?",
    "What should I do if my dog is constipated?",
    "How do I stop my dog from jumping on people?",
    "Why is my dog shedding so much?",
    "How do I teach my dog to fetch?",
    "What are the signs of heatstroke in dogs?",
    "How do I stop my dog from pulling on the leash?",
    "Why is my dog whining all the time?",
    "How do I house train my puppy?",
    "What should I do if my dog has diarrhea?",
    "How do I stop my dog from chasing cars?",
    "Why is my dog afraid of the vacuum cleaner?",
    "How do I introduce my dog to a new baby?",
    "What are the best ways to keep my dog cool in the summer?",
    "How do I stop my dog from chewing on furniture?",
    "Why is my dog licking its paws?",
    "How do I teach my dog to stay?",
    "What should I do if my dog is vomiting?",
    "How do I stop my dog from barking at night?",
    "Why is my dog afraid of fireworks?",
    "How do I clean my dog's teeth?",
    "What are the signs of arthritis in dogs?",
    "How do I stop my dog from begging at the table?",
    "Why is my dog scooting on the floor?",
    "How do I teach my dog to come when called?"
];

export const PromptButtons = (props) => {
    const [currentPrompts, setCurrentPrompts] = useState([]);
    const [fade, setFade] = useState(true);

    // Optimized random prompt selection
    const getRandomPrompts = useCallback(() => {
        let selectedPrompts = new Set();
        while (selectedPrompts.size < 3) {
            const randomIndex = Math.floor(Math.random() * prompts.length);
            selectedPrompts.add(prompts[randomIndex]);
        }
        return Array.from(selectedPrompts);
    }, []);

    useEffect(() => {
        const updatePrompts = () => {
            setFade(false);
            setTimeout(() => {
                setCurrentPrompts(getRandomPrompts());
                setFade(true);
            }, 1500);
        };

        setCurrentPrompts(getRandomPrompts()); // Initial render
        const intervalId = setInterval(updatePrompts, 9000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [getRandomPrompts]);

    return (
        <HStack spacing="20px" wrap="wrap" justify="center">
            {currentPrompts.map((prompt, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: fade ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    <Button
                        width="220px" // Increased width
                        minHeight="100px" // Minimum height, prevents clipping
                        padding="15px"
                        borderRadius="20px"
                        fontSize="md" // Medium-sized text
                        whiteSpace="normal" // Allows text to wrap
                        textAlign="center" // Centers text
                        fontWeight="semibold"
                        boxShadow="md"
                        bg="#7FFFD4"
                        color="black"
                        _hover={{ bg: "#66CDAA", boxShadow: "lg" }} // Hover effect
                        onClick={() => props.onPromptSelect(prompt)}
                    >
                        {prompt}
                    </Button>
                </motion.div>
            ))}
        </HStack>
    );
};

export default PromptButtons;
