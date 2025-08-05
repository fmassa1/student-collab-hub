import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
//import About from './pages/about';
import Contact from './pages/contact';
import Projects from './pages/projects';
import Navbar from './components/navbar';
import Footer from './components/footer';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;