import apiClient from '../client';

export const login = async (email, password) => {
    const objApi = apiClient('/api/v1/user/auth/');
    try {
        var response = await objApi.post({ email: email, password: password })
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}