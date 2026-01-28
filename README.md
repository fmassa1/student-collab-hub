# PeerSpark  

A full-stack web application for showcasing and discovering projects. Users can upload projects with images, add tags, view details, like projects, and track engagement.  

---

## Features  

- **Project Uploads**  
  - Upload up to **3 images per project** with live preview.  
  - Remove unwanted images before submitting with an inline trash icon.  
  - Add tags to projects

- **Project Display**  
  - Responsive **image slider** with swipe support (mobile-friendly).  
  - Automatic likes and views count displayed for each project.  
  - Comment section to allow users to interact with each other.

- **Profile Page**  
  - Allows users to upload profile pictures.
  - Users able to update profile information.
  - Displays all projects from user. 

- **Tag Filtering**  
  - Filter projects by tags.  
  - SQL query ensures projects must match **all selected tags**.  

- **Engagement Tracking**  
  - Track number of likes, views, and comments per project.  

- **Notifications**  
  - Users recieve notifications if others like or comment project.  

---

## Tech Stack  

**Frontend**  
- React (with Hooks + Context)  
- Custom components
- CSS for responsive design  

**Backend**  
- Node.js / Express  
- REST API endpoints for projects, users, likes, and views  
- Multer for handling image uploads  
- jwt used for authentication

**Database**  
- MySQL with relational schema  
  - `projects`  
  - `project_tags`  
  - `project_likes`  
  - `project_views`  
  - `project_images`  

---

