import apiClient from '../client';

export const createProjectField = async (formData, token) =>{
    const objApi = apiClient('project/fields/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getProjectField= async (token, projectId) => {
    const objApi = apiClient('project/fields?project_app_id='+projectId);
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const updateProjectField= async (projectId, formData, token) =>{
    const objApi = apiClient('project/fields');
    try {
        var response = await objApi.patch(projectId, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteProjectField= async (token, projectId) => {
    const objApi = apiClient('project/fields');
    try {
        var response = await objApi.del(projectId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}