import TagSelector from "../../../../components/TagSelector/TagSelector";
import "./ProjectEditForm.css";

function ProjectEditForm({ 
    formData,
    onChange,
    tagsChange,
    onSave,
    onCancel
 }) {

    return (
        <div className="project-edit-form">
            <input name="name" value={formData.name || ""} onChange={onChange} />
            <input name="description" value={formData.description || ""} onChange={onChange} />
            <TagSelector
                selected={formData.tags}
                setSelected={tagsChange} 
            />
            <button onClick={onSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default ProjectEditForm;
