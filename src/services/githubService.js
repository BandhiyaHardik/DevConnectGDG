import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchUserData = async (accessToken) => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data from GitHub:', error);
        throw error;
    }
};

export const fetchUserRepos = async (username) => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/users/${username}/repos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user repositories from GitHub:', error);
        throw error;
    }
};

export const fetchUserFollowers = async (username) => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/users/${username}/followers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user followers from GitHub:', error);
        throw error;
    }
};