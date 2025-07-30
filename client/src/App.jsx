import './App.css';

function App() {
  return (
    <div className="app">
      <header className="hero">
        <h1>🎓 Welcome to PeerSpark</h1>
        <p>A place to discover collaborators, build projects, and spark ideas together.</p>
        <div className="cta-buttons">
          <button onClick={() => alert("Browse Projects")}>Browse Projects</button>
          <button onClick={() => alert("Post a Project")}>Post a Project</button>
        </div>
      </header>
    </div>
  );
}

export default App;
