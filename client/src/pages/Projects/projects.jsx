import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthContext } from "../../context/AuthContext";
import ErrorPage from "../../components/ErrorPage/error";
import TagSelector from "../../components/TagSelector/TagSelector";

import './projects.css';

function Projects() {
    const [error, setError] = useState(null);
    const [allProjects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const { token } = useContext(AuthContext);
    
    const location = useLocation();
    const navigate = useNavigate();

    const [sort, setSort] = useState("date_posted");
    const [order, setOrder] = useState("desc");

    const [formData, setFormData] = useState({
        tags: []
    });


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tags = params.get('tags'); 
        const sortParam = params.get('sort') || "date_posted"; 
        const orderParam = params.get('order') || "desc"; 

        setSort(sortParam);
        setOrder(orderParam); 

        let url = 'http://localhost:5055/api/projects';
        const query = [];
        if (tags) query.push(`tags=${encodeURIComponent(tags)}`);
        if (sortParam) query.push(`sort=${encodeURIComponent(sortParam)}`);
        if (orderParam) query.push(`order=${encodeURIComponent(orderParam)}`);
        if (query.length) url += `?${query.join("&")}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            return res.json();
        })
        .then(data => {
            console.log('Fetched projects:', data);
            setProjects(data);
        })
        
        .catch(err => {
            console.error("Fetch failed:", err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
        });
    }, [location.search, token]);
    
    if (error) {
        return <ErrorPage code={error}  />;
    }
    const loadMore = () => {
        setVisibleCount(prev=> Math.min(prev + 10, allProjects.length));
    };

    const visibleProjects = allProjects.slice(0, visibleCount);

    const handleTagsChange = (tags) => {
        setFormData(prev => ({ ...prev, tags }));
        const query = new URLSearchParams(location.search);

        if (tags.length > 0) {
            query.set("tags", tags.join(","));
        } else {
            query.delete("tags");
        }

        navigate({
            pathname: "/projects",
            search: query.toString()
        });
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSort(newSort);

        const query = new URLSearchParams(location.search);
        query.set("sort", newSort);
        query.set("order", order);

        navigate({
            pathname: "/projects",
            search: query.toString()
        });
    };

    const toggleOrder = () => {
        const newOrder = order === "desc" ? "asc" : "desc";
        setOrder(newOrder);

        const query = new URLSearchParams(location.search);
        query.set("sort", sort);
        query.set("order", newOrder);

        navigate({
            pathname: "/projects",
            search: query.toString()
        });
    };

    return (
        <div className="projects-page">
            <h1 className="projects-heading">Featured Projects</h1>

            <div className='sort-controls'>
                <select value={sort} onChange={handleSortChange}>
                    <option value="date_posted">Date Posted</option>
                    <option value="views">Views</option>
                    <option value="likes">Likes</option>
                </select>
                <button onClick={toggleOrder}>
                    {order === "desc" ? "↓ Desc" : "↑ Asc"}
                </button>
            </div>

            <div className="filter-by-tag">
                <TagSelector 
                    selected={formData.tags || []}
                    setSelected={handleTagsChange}
                />
            </div>

            <div className="project-grid">
                {visibleProjects.map(project => (
                <div key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
                    <img src={project.image_url} alt={project.name} />
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                    <div className="icon-container">
                    {project.linkedin_url ? (
                        <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src='/linkedin.svg' alt="LinkedIn" />
                            </a>
                        ) : null}
                    {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <img src='/github.svg' alt="Github" />
                        </a>
                    ) : null}
                    </div>
                </div>
                ))}
            </div>
            {visibleCount < allProjects.length && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default Projects;