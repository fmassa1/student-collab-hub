export const isValidGitHubUrl = (string) => {
    try {
        new URL(string);
        return string.startsWith('https://github.com') || string.startsWith('https://www.github.com')

    } catch (_) {
        return false;
    }
}

export const isValidLinkedInUrl = (string) => {
    try {
        new URL(string);
        return string.startsWith('https://linkedin.com') || string.startsWith('https://www.linkedin.com')

    } catch (_) {
        return false;
    }
}