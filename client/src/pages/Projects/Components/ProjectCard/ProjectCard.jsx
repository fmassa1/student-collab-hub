import { useNavigate } from 'react-router-dom';

import "./ProjectCard.css";

function ProjectCard({
    project
  }) {

    const navigate = useNavigate();

    return (
        <div key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
            <img src={project.image_url || "/placeholder.jpg"} alt={"project_image"} />
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="icon-container">
                {project.github_url ? (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <img src='/svg/github.svg' alt="Github" />
                    </a>
                ) : null}
            </div>
        </div>
    );

}

export default ProjectCard;