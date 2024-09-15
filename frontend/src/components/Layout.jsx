import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar'; // Import your Navbar component

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">

      <Box flex="1">{children}</Box>
    </Box>
  );
};

export default Layout;
