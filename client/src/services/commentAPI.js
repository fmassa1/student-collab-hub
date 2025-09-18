import apiClient from "./apiClient";

export async function postComment(projectId, comment) {
    // const res = await fetch(
    //     `http://localhost:5055/api/projects/${projectId}/comments`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify({ comment })
    //     }
    // );

    // if (!res.ok) throw new Error(res.status);
    // return await res.json();
    const res = await apiClient.post(`projects/${projectId}/comments`, JSON.stringify({ comment }));
    return res.data;

}

export async function deleteComment(projectId, commentId) {
    // const res = await fetch(
    //     `http://localhost:5055/api/projects/${projectId}/comments/${commentId}`,
    //     {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     }
    // );

    // if (!res.ok) throw new Error(res.status);
    // return res;
    const res = await apiClient.delete(`projects/${projectId}/comments/${commentId}`);
    return res.data;
}

export async function likeComment(projectId, commentId) {
    // const res = await fetch(
    //     `http://localhost:5055/api/projects/${projectId}/comments/${commentId}/like`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         },
    //     }
    // );

    // if (!res.ok) throw new Error(res.status);
    // return await res.json();
    const res = await apiClient.post(`projects/${projectId}/comments/${commentId}/like`);
    return res.data;
}

export async function unlikeComment(projectId, commentId) {
    // const res = await fetch(
    //     `http://localhost:5055/api/projects/${projectId}/comments/${commentId}/unlike`,
    //     {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     }
    // );

    // if (!res.ok) throw new Error(res.status);
    // return res;
    const res = await apiClient.delete(`projects/${projectId}/comments/${commentId}/unlike`);
    return res.data;
}