import './footer.css';

function Footer() {
  return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <a href="/" className="logo">Peer Spark</a>
            <p>Connecting CS students to collaborate on innovative ideas.</p>
          </div>
  
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="#post-project" onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }}>Post Project</a>
              <a href="/projects">Explore Projects</a>
            </div>
  
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Use</a>
            </div>
          </div>
  
          <div className="footer-right">
            <p>&copy; {new Date().getFullYear()} Peer Spark. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;