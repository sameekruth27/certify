import React, { useState } from 'react';
import {
  Container,
  Text,
  VStack,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

const VerifyPage = () => {
  const [certificateImage, setCertificateImage] = useState(null);
  const [isValid, setIsValid] = useState(null); // null, true, or false
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/png, image/jpeg',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCertificateImage(URL.createObjectURL(file));
        setIsValid(null); // Reset validity status on new upload
      }
    },
  });

  const handleVerify = () => {
    if (!certificateImage) {
      toast({
        title: 'Error',
        description: 'Please upload a certificate to verify',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Placeholder for actual verification logic
    // Assume all certificates are valid for this example
    setIsValid(true);

    toast({
      title: 'Verification Successful',
      description: 'The certificate is valid.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={8} align="flex-start">
        <Text fontSize="2xl" fontWeight="bold">Verify Certificate</Text>

        {/* Certificate Display */}
        {certificateImage && (
          <Box>
            <Text fontSize="lg" mb={2}>Certificate:</Text>
            <Image
              src={certificateImage}
              alt="Certificate"
              maxW="100%"
              borderRadius="md"
            />
          </Box>
        )}

        {/* File Upload */}
        <FormControl>
          <FormLabel htmlFor="certificate-upload">Upload Certificate Image</FormLabel>
          <Box
            {...getRootProps()}
            borderWidth={2}
            borderStyle="dashed"
            borderColor="gray.300"
            p={4}
            borderRadius="md"
            textAlign="center"
          >
            <Input {...getInputProps()} id="certificate-upload" />
            <Text mt={2}>Drag & drop a file here, or click to select one</Text>
          </Box>
        </FormControl>

        {/* Verify Button */}
        <Button
          colorScheme="blue"
          onClick={handleVerify}
          isDisabled={!certificateImage}
        >
          Verify
        </Button>

        {/* Verification Result */}
        {isValid === true && (
          <Text color="green.500" fontSize="lg" fontWeight="bold">
            The certificate is valid.
          </Text>
        )}
        {isValid === false && (
          <Text color="red.500" fontSize="lg" fontWeight="bold">
            The certificate is invalid.
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default VerifyPage;
