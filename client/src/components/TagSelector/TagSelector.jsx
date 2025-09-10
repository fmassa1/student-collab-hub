import React, { useState } from "react";
import "./tagselector.css";
import tags from "./projectTags.json";

function TagSelector({ selected, setSelected }) {
    const [search, setSearch] = useState("");

    const filteredOptions = tags.filter(
        (tag) =>
            tag.label.toLowerCase().includes(search.toLowerCase()) &&
            !selected.includes(tag.id)
    );

    const addTag = (tag) => {
        setSelected([...selected, tag.id]);
        setSearch(""); 
    };

    const removeTag = (id) => {
        setSelected(selected.filter((t) => t !== id));
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
                    filteredOptions.map((tag) => (
                    <li key={tag.id} onClick={() => addTag(tag)}>
                        {tag.label}
                    </li>
                    ))
                )}
                </ul>
            )}
            <div className="selected-tags">
                {selected.map((id) => {
                    const tag = tags.find((t) => t.id === id);
                    return (
                        <span key={id} className="tag-chip">
                            {tag?.label}
                            <button type="button" onClick={() => removeTag(id)}>
                                ✕
                            </button>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default TagSelector;
