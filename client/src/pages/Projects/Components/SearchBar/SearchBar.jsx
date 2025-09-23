import TagSelector from "../../../../components/TagSelector/TagSelector";
import "./SearchBar.css";

function SearchBar({
    tags,
    sort,
    order,
    handleSortChange,
    toggleOrder,
    handleTagsChange
}) {


    return (
        <div className="search-container">
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
                    selected={tags || []}
                    setSelected={handleTagsChange}
                />
            </div>
        </div>
    );

}

export default SearchBar;