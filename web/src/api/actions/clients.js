import apiClient from '../client';

export const create = async (formData, token) =>{
    const objApi = apiClient('user/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const login = async (email, password) => {
    const objApi = apiClient('user/auth/');
    try {
        var response = await objApi.post({ email: email, password: password })
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getAll = async (token) => {
    const objApi = apiClient('user?is_active=true');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getCustomers = async (token) => {
    const objApi = apiClient('user?is_superuser='+false);
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getClient = async (token, userId) => {
    const objApi = apiClient('user/'+userId+'/');
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const resetPassword = async (token, userId) => {

    const objApi = apiClient('user/reset-password/');
    try {
        var response = await objApi.post({ id : userId }, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }

}

export const deleteUser = async (token, userId) => {

    const objApi = apiClient('user');
    try {
        var response = await objApi.del(userId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }

}

export const updateClient = async (formData, token, userId) => {
    
    const objApi = apiClient('user');
    try {
        var response = await objApi.patch(userId, formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
    
}

export const changePassword = async (formData, token) => {
    
    const objApi = apiClient('user/change-password/');
    try {
        var response = await objApi.patch(undefined, formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const filterClients = async (token, filterData) => {
    const objApi = apiClient('user?email='+filterData);
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}