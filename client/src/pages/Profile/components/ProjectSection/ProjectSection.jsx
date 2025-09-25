import { useNavigate } from "react-router-dom";
import "./ProjectSection.css";

function ProjectSection({ profile, projects }) {
    const navigate = useNavigate();

    return (
        <div className="projects-section">
            <div className="section-header">
                <h2>{profile.first_name}'s Projects</h2>
                <div className="projects-count">
                    {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                </div>
            </div>
            
            {projects.length > 0 ? (
                <div className="projects-grid">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="project-card"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <div className="project-header">
                                <h3>{project.name}</h3>
                                <div className="project-arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-footer">
                                <span className="view-project">View Project</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                    </div>
                    <h3>No Projects Yet</h3>
                    <p>Projects will appear here once {profile.first_name} adds them to their profile.</p>
                </div>
            )}
        </div>
    );
}

export default ProjectSection;
