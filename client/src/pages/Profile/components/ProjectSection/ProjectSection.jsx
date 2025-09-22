import { useNavigate } from "react-router-dom";
import "./ProjectSection.css";

function ProjectSection({ profile, projects }) {
    const navigate = useNavigate();

    return (
        <div className="projects-section">
            <h2>{profile.first_name}'s Projects</h2>
            {projects.length > 0 ? (
                <ul className="projects-list">
                {projects.map((project, idx) => (
                    <li
                    key={idx}
                    className="project-card"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    >
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No projects found for this user.</p>
            )}
        </div>
    );
}

export default ProjectSection;
