import { useState, useEffect } from "react";
import { Textarea, IconButton, Box } from "@chakra-ui/react";
import { FaArrowAltCircleUp } from "react-icons/fa";

export const QueryBox = ({ onQuerySubmit, viewHeight }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendQuery = () => {
        if (query.trim() !== "" && !loading) {
            setLoading(true);
            onQuerySubmit(query).finally(() => setLoading(false));
            setQuery("");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendQuery();
        }
    };

    useEffect(() => {
        const handleGlobalKeyPress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSendQuery();
            }
        };

        document.addEventListener("keydown", handleGlobalKeyPress);

        return () => {
            document.removeEventListener("keydown", handleGlobalKeyPress);
        };
    }, [query]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height={viewHeight}>
            <Box w="33vw" minW="350px" position="relative">
                <Textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoresize 
                    maxH="20rem" 
                    width="100%" 
                    borderRadius="45px"
                    fontSize="18px"
                    border="2px solid #7FFFD4"
                    py="20px"
                    pl="30px"
                    pr="80px"
                    bg="#FFF6E5"
                    mb="20px"
                    placeholder="Type here to ask a question..."
                    _placeholder={{ color: "black" }}
                    color="black"
                    display="flex"
                    boxShadow="0px 5px 5px rgba(0, 0, 0, 0.37)"
                />
            
                <IconButton 
                    disabled={loading}
                    onClick={handleSendQuery}
                    rounded="full" 
                    size="xl" 
                    position="absolute" 
                    right="20px" 
                    bottom="13px"
                    transform="translateY(-50%)" 
                    aria-label="Send Query"
                    bg="#29CC96"
                    _hover={{ bg: "#f5cb42" }}
                >
                    <FaArrowAltCircleUp color="black"/>
                </IconButton>
            </Box>
        </Box>
    );
};

export default QueryBox;
