import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ErrorPage from "../../components/ErrorPage/error";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import SearchBar from "./components/SearchBar/SearchBar";
import { getProjectSearch } from "../../services/projectAPI";

import './projects.css';

function Projects() {
    const [error, setError] = useState(null);
    const [allProjects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    
    const location = useLocation();
    const navigate = useNavigate();

    const [sort, setSort] = useState("date_posted");
    const [order, setOrder] = useState("desc");

    const [formData, setFormData] = useState({
        tags: []
    });


    useEffect(()  => {
        async function fetchData() {
            const params = new URLSearchParams(location.search);
            const tags = params.get('tags'); 
            const sortParam = params.get('sort') || "date_posted"; 
            const orderParam = params.get('order') || "desc"; 

            setSort(sortParam);
            setOrder(orderParam); 

            let url = '/projects';
            const query = [];
            if (tags) query.push(`tags=${encodeURIComponent(tags)}`);
            if (sortParam) query.push(`sort=${encodeURIComponent(sortParam)}`);
            if (orderParam) query.push(`order=${encodeURIComponent(orderParam)}`);
            if (query.length) url += `?${query.join("&")}`;


            try {
                const data = await getProjectSearch(url);
                setProjects(data);
            } catch (err) {
                console.error("Fetch failed:", err);
                const statusCode = parseInt(err.message);
                setError(statusCode || 500);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [location.search]);
    
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
            <SearchBar
                tags={formData.tags}
                sort={sort}
                order={order}
                handleSortChange={handleSortChange}
                toggleOrder={toggleOrder}
                handleTagsChange={handleTagsChange}
            />

            <div className="project-grid">
                {visibleProjects.map(project => (
                    <ProjectCard project={project}/>
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