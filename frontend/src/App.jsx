import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import Verify from "./pages/Verify";
import Generate from "./pages/Generate";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Layout from './components/Layout';

function App() {
	return (
		<Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
			<Navbar />
      <Layout>
			<Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/generate' element={<Generate />} />
			</Routes>
      </Layout>
		</Box>
	);
}

export default App;
