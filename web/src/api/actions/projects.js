import apiClient from '../client';

export const create = async (formData, token) =>{
    const objApi = apiClient('project/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getAllProjects = async (token) => {
    const objApi = apiClient('project?is_active=true');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const deleteProject = async (token, projectId) => {
    const objApi = apiClient('project');
    try {
        var response = await objApi.del(projectId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}