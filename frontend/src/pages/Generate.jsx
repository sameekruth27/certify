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
  useToast,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import axios from 'axios';  // Added axios for HTTP requests

const GeneratePage = () => {
  const [file, setFile] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [linkText, setLinkText] = useState('');
  const [data, setData] = useState([]);
  const [csvPreview, setCsvPreview] = useState([]);
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      Papa.parse(file, {
        complete: (results) => {
          const previewData = results.data.slice(0, 4); // Get the first 4 rows
          setData(results.data);
          setCsvPreview(previewData);
        },
        header: true,
      });
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCertificateImage(file);  // Storing the actual file
  };

  const handleGenerateCertificates = async () => {
    if (!data.length || !certificateImage || !linkText) {
      toast({
        title: 'Error',
        description: 'Please provide all inputs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // The Excel CSV file
    formData.append('certificate_template', certificateImage);  // The certificate design image
    formData.append('base_link', linkText);  // The base link for the QR codes

    try {
      const response = await axios.post('http://localhost:8000/generate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success',
        description: 'Certificates have been generated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Optionally handle the response or show the generated data
      console.log('Generated certificates:', response.data);

    } catch (error) {
      console.error('Error generating certificates:', error);
      toast({
        title: 'Error',
        description: 'There was an error generating certificates.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={8} align="flex-start">
        <Text fontSize="2xl" fontWeight="bold">Generate Certificates</Text>

        {/* File Upload */}
        <FormControl>
          <FormLabel htmlFor="file-upload">Upload Excel File (CSV format)</FormLabel>
          <Box {...getRootProps()} borderWidth={2} borderStyle="dashed" borderColor="gray.300" p={4} borderRadius="md" textAlign="center">
            <Input {...getInputProps()} id="file-upload" />
            <Text mt={2}>Drag & drop a file here, or click to select one</Text>
          </Box>
        </FormControl>

        {/* CSV Preview */}
        {csvPreview.length > 0 && (
          <Box mt={6} width="100%">
            <Text fontSize="lg" mb={2}>CSV Preview:</Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {Object.keys(csvPreview[0] || {}).map((key) => (
                    <Th key={key}>{key}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {csvPreview.map((row, index) => (
                  <Tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <Td key={i}>{value}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Certificate Image Upload */}
        <FormControl>
          <FormLabel htmlFor="image-upload">Upload Certificate Design Image</FormLabel>
          <Input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
        </FormControl>

        {/* Certificate Design Image Preview */}
        {certificateImage && (
          <Box>
            <Text fontSize="lg" mb={2}>Certificate Design Preview:</Text>
            <Image src={URL.createObjectURL(certificateImage)} alt="Certificate Design" maxW="100%" borderRadius="md" />
          </Box>
        )}

        {/* Base Link Text */}
        <FormControl>
          <FormLabel htmlFor="link-text">Base Link</FormLabel>
          <Input
            id="link-text"
            type="text"
            placeholder="Enter base link"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </FormControl>

        {/* Generate Button */}
        <Button
          colorScheme="blue"
          onClick={handleGenerateCertificates}
          isDisabled={!file || !certificateImage || !linkText}
        >
          Generate Certificates
        </Button>
      </VStack>
    </Container>
  );
};

export default GeneratePage;
