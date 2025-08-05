import '../css/home.css';

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Connect. Collaborate. Create.</h1>
        <p>
          The platform where computer science students find collaborators for side projects and research.
          Turn your ideas into reality with the help of your peers.
        </p>
        <div className="hero-buttons">
          <a
            href="#post-project"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              alert('Post Project feature coming soon!');
            }}
          >
            Post Your Project
          </a>
          <a
            href="#explore"
            className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              alert('Explore Projects feature coming soon!');
            }}
          >
            Explore Projects
          </a>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2>Why Choose Peer Spark?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon"></span>
              <h3>Launch Your Ideas</h3>
              <p>Share your side projects and research ideas with fellow CS students who share your passion for innovation.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon"></span>
              <h3>Find Collaborators</h3>
              <p>Connect with students who have complementary skills and interests to bring your projects to life.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon"></span>
              <h3>Learn & Grow</h3>
              <p>Gain hands-on experience, build your portfolio, and develop skills that go beyond the classroom.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
