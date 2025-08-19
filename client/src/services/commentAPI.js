
export async function postComment(projectId, comment, token) {
    const res = await fetch(
        `http://localhost:5055/api/projects/${projectId}/comments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment })
        }
    );

    if (!res.ok) throw new Error(res.status);
    return await res.json();
}

export async function deleteComment(projectId, commentId, token) {
    const res = await fetch(
        `http://localhost:5055/api/projects/${projectId}/comments/${commentId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!res.ok) throw new Error(res.status);
    return res;
}