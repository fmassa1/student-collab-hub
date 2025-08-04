import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import NavBar from './navbar.jsx';

const navbarRoot = createRoot(document.getElementById('navbar-root'));
navbarRoot.render(<NavBar />);

const appRoot = createRoot(document.getElementById('root'));
appRoot.render(
  <StrictMode>
    <App />
  </StrictMode>
);
