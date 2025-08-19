import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/home';
//import About from './pages/about';
import Contact from './pages/Contact/contact';
import Projects from './pages/Projects/projects';
import Profile from './pages/Profile/profile';
import ProjectDetails from './pages/ProjectDetails/projectdetails';
import CreateProject from './pages/CreateProject/createproject';
import SignUp from './pages/SignUp/signup';
import Navbar from './components/NavBar/navbar';
import Footer from './components/Footer/footer';
import ErrorPage from './components/ErrorPage/error';

import './styles/App.css'
import LoginPage from './pages/Login/login';
import ProtectedRoute from './context/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />

        
        <Route path="/create" element={<ProtectedRoute> <CreateProject /> </ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute> <Projects /> </ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute> <ProjectDetails /> </ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />


        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<ErrorPage code={404}/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;