import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/home';
//import About from './pages/about';
import Contact from './pages/Contact/contact';
import Projects from './pages/Projects/projects';
import ProjectDetails from './pages/ProjectDetails/projectdetails';
import CreateProject from './pages/CreateProject/createproject';
import Navbar from './components/NavBar/navbar';
import Footer from './components/Footer/footer';

import './styles/App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/create" element={<CreateProject />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;