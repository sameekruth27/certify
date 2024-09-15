import { useState, useEffect } from "react";
import { Container, Text, VStack, Box, HStack, Link as ChakraLink, Image, useColorMode } from "@chakra-ui/react";
// Import your image from the assets folder
import certificateImage from '../assets/documents.png'; // Adjust path if needed

const HomePage = () => {
  const { colorMode } = useColorMode(); // Chakra UI hook to get current color mode
  const [dynamicText, setDynamicText] = useState("Generate");

  // Change the text between "Generate" and "Verify"
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicText((prevText) => (prevText === "Generate" ? "Verify" : "Generate"));
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxW="container.xl" py={12}>
      {/* Hero Section */}
      <HStack spacing={20} alignItems="center" justifyContent="center" py={16}>
        {/* Centered Title and Description */}
        <VStack align="flex-start" spacing={6} textAlign="center" maxW="lg">
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
          >
            {dynamicText} Your Certificates Now!
          </Text>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            color={colorMode === "light" ? "gray.600" : "white"} // Conditionally change color
          >
            This website allows you to seamlessly generate and verify certificates with ease. Whether
            you're creating a new certificate or verifying an existing one, our platform provides a secure
            and efficient solution for all your certification needs.
          </Text>
        </VStack>

        {/* Image on the right from assets folder */}
        <Box w={{ base: "full", lg: "25%" }}>
          <Image
            src={certificateImage} // Use the imported image
            alt="Certificate verification"
            objectFit="cover"
            borderRadius="md"
          />
        </Box>
      </HStack>

      {/* Developer Info */}
      <Text textAlign="center" fontSize="sm" color="gray.500" mt={20}>
        Developed by{" "}
        <ChakraLink href="https://www.linkedin.com/in/sameekruth-talari" isExternal color="blue.500">
          Sameekruth Talari
        </ChakraLink>{" "}
        and{" "}
        <ChakraLink href="https://www.linkedin.com/in/goutham-kolla-90aaa526a/" isExternal color="blue.500">
          Gowtham Kolla
        </ChakraLink>
      </Text>
    </Container>
  );
};

export default HomePage;
