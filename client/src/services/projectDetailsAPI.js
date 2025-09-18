import apiClient from "./apiClient";


//MARK: Project API
export async function getProject(projectId) {
    const res = await apiClient.get(`projects/${projectId}`);
    return res.data;
}

export async function updateProject(projectId, newData) {
    const res = await apiClient.put(`projects/${projectId}`, newData);
    return res.data;
}

export async function deleteProject(projectId) {
    const res = await apiClient.delete(`projects/${projectId}`);
    return res;
}


//MARK: Like API
export async function likeProject(projectId) {
    const res = await apiClient.post(`projects/${projectId}/like`);
    return res;
}

export async function unlikeProject(projectId) {
    const res = await apiClient.delete(`projects/${projectId}/unlike`);
    return res;
}


//MARK: Comment API
export async function postComment(projectId, comment) {
    const res = await apiClient.post(`projects/${projectId}/comments`, JSON.stringify({ comment }));
    return res.data;
}

export async function deleteComment(projectId, commentId) {
    const res = await apiClient.delete(`projects/${projectId}/comments/${commentId}`);
    return res.data;
}

export async function likeComment(projectId, commentId) {
    const res = await apiClient.post(`projects/${projectId}/comments/${commentId}/like`);
    return res.data;
}

export async function unlikeComment(projectId, commentId) {
    const res = await apiClient.delete(`projects/${projectId}/comments/${commentId}/unlike`);
    return res.data;
}