import React, { useState } from 'react';
import axios from 'axios';
import { Container, VStack, Box, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

const GeneratePage = () => {
  const [template, setTemplate] = useState(null);
  const [excel, setExcel] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('static/generated_certificates');
  const [codeSerial, setCodeSerial] = useState('');
  const [codesStartNumber, setCodesStartNumber] = useState(1000);
  const [jsonFileName, setJsonFileName] = useState('Data.json');
  const [jsonDirectory, setJsonDirectory] = useState('static');
  const toast = useToast();

  const { getRootProps: getTemplateProps, getInputProps: getTemplateInputProps } = useDropzone({
    accept: '.png',
    onDrop: (acceptedFiles) => setTemplate(acceptedFiles[0]),
  });

  const { getRootProps: getExcelProps, getInputProps: getExcelInputProps } = useDropzone({
    accept: '.xlsx',
    onDrop: (acceptedFiles) => setExcel(acceptedFiles[0]),
  });

  const handleGenerate = async () => {
    if (!template || !excel || !baseUrl) {
      toast({
        title: 'Error',
        description: 'Please provide all inputs.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('template', template);
    formData.append('excel', excel);
    formData.append('base_url', baseUrl);
    formData.append('output_directory', outputDirectory);
    formData.append('code_serial', codeSerial);
    formData.append('codes_start_number', codesStartNumber);
    formData.append('json_file_name', jsonFileName);
    formData.append('json_directory', jsonDirectory);

    try {
      const response = await axios.post('http://localhost:8000/api/generate-certificates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error generating certificates.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={8} align="flex-start">
        <FormControl>
          <FormLabel>Upload Certificate Template</FormLabel>
          <Box {...getTemplateProps()} borderWidth={2} borderStyle="dashed" borderColor="gray.300" p={4} borderRadius="md" textAlign="center">
            <Input {...getTemplateInputProps()} />
            <p>Drag & drop a PNG file here, or click to select one</p>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Upload Excel File</FormLabel>
          <Box {...getExcelProps()} borderWidth={2} borderStyle="dashed" borderColor="gray.300" p={4} borderRadius="md" textAlign="center">
            <Input {...getExcelInputProps()} />
            <p>Drag & drop an Excel file here, or click to select one</p>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Base URL</FormLabel>
          <Input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="Enter base URL for QR codes" />
        </FormControl>

        <FormControl>
          <FormLabel>Output Directory</FormLabel>
          <Input type="text" value={outputDirectory} onChange={(e) => setOutputDirectory(e.target.value)} placeholder="Enter output directory" />
        </FormControl>

        <FormControl>
          <FormLabel>Code Serial</FormLabel>
          <Input type="text" value={codeSerial} onChange={(e) => setCodeSerial(e.target.value)} placeholder="Enter code serial" />
        </FormControl>

        <FormControl>
          <FormLabel>Codes Start Number</FormLabel>
          <Input type="number" value={codesStartNumber} onChange={(e) => setCodesStartNumber(Number(e.target.value))} placeholder="Enter starting number" />
        </FormControl>

        <FormControl>
          <FormLabel>JSON File Name</FormLabel>
          <Input type="text" value={jsonFileName} onChange={(e) => setJsonFileName(e.target.value)} placeholder="Enter JSON file name" />
        </FormControl>

        <FormControl>
          <FormLabel>JSON Directory</FormLabel>
          <Input type="text" value={jsonDirectory} onChange={(e) => setJsonDirectory(e.target.value)} placeholder="Enter JSON directory" />
        </FormControl>

        <Button colorScheme="blue" onClick={handleGenerate}>Generate Certificates</Button>
      </VStack>
    </Container>
  );
};

export default GeneratePage;
