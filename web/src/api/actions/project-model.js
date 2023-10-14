import apiClient from '../client';

export const createProjectModel = async (formData, token) =>{
    const objApi = apiClient('project/models/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getProjectModel = async (token, projectId) => {
    const objApi = apiClient('project/models?project_app_id='+projectId);
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const updateProjectModel = async (projectId, formData, token) =>{
    const objApi = apiClient('project/models');
    try {
        var response = await objApi.patch(projectId, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteProjectModel = async (token, projectId) => {
    const objApi = apiClient('project/models');
    try {
        var response = await objApi.del(projectId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}