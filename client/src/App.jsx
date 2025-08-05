import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
//import About from './pages/about';
import Contact from './pages/contact';
import Navbar from './components/navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;