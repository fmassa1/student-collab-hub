import apiClient from "./apiClient";


export async function loginUser(loginData) {
    const res = await apiClient.post(`login`, loginData);
    return res.data;
}

export async function getProfile(username) {
    const res = await apiClient.get(`/profile/${username}`);
    return res.data[0];
}

export async function getProjects(username) {
    const res = await apiClient.get(`/profile/${username}/projects`);
    return res.data;
}

export async function updateProfile(username, profileData) {
    const res = await apiClient.put(`/profile/${username}`, profileData);
    return res.data;
}

export async function uploadProfilePicture(username, file) {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const res = await apiClient.post(
        `/profile/${username}/profilepicture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
}
