import apiClient from '../client';


export const getApps = async (app_id, token) =>{
    console.log("token", token);
    const objApi = apiClient('project/apps/'+app_id+'/');
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const createApp = async (formData, token) =>{
    const objApi = apiClient('project/apps/');
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const updateApp = async (app_id, formData, token) =>{
    const objApi = apiClient('project/apps');
    try {
        var response = await objApi.patch(app_id, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteApp = async (field_id, token) =>{
    const objApi = apiClient('project/apps');
    try {
        var response = await objApi.del(field_id, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}