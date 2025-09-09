import React, { useState } from "react";
import "./tagselector.css";

function TagSelector({ options, selected, setSelected }) {
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter(
        (opt) =>
        opt.toLowerCase().includes(search.toLowerCase()) &&
        !selected.includes(opt)
    );

    const addTag = (tag) => {
        setSelected([...selected, tag]);
        setSearch(""); 
    };

    const removeTag = (tag) => {
        setSelected(selected.filter((t) => t !== tag));
    };

    return (
        <div className="tag-selector">
            

            <input
                type="text"
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
                <ul className="dropdown">
                {filteredOptions.length === 0 ? (
                    <li className="no-match">No matches</li>
                ) : (
                    filteredOptions.map((opt) => (
                    <li key={opt} onClick={() => addTag(opt)}>
                        {opt}
                    </li>
                    ))
                )}
                </ul>
            )}
            <div className="selected-tags">
                {selected.map((tag) => (
                <span key={tag} className="tag-chip">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                        ✕
                    </button>
                </span>
                ))}
            </div>
        </div>
    );
}

export default TagSelector;
