import apiClient from '../client';

export const login = async (email, password) => {
    const objApi = apiClient('user/auth/');
    try {
        var response = await objApi.post({ email: email, password: password })
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const logout = async (email, password) => {
    const objApi = apiClient('user/logout/');
    try {
        var response = await objApi.post({}, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}