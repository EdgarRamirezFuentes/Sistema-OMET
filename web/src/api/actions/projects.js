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

export const getProject = async (token, projectId) => {
    console.log("token", token);
    console.log("projectId", projectId);
    const objApi = apiClient('project/'+projectId+'/');
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const updateProject = async (projectId, formData, token) =>{
    const objApi = apiClient('project');
    try {
        var response = await objApi.patch(projectId, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
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

export const createProjectMaintenance = async (formData, token) =>{
    const objApi = apiClient('project/maintenance/');
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteProjectMaintenance = async (token, maintenanceId) => {
    const objApi = apiClient('project/maintenance');
    try {
        var response = await objApi.del(maintenanceId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getProjectModels = async (token, projectId) => {

    const objApi = apiClient('project/models?project_id='+projectId);
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}


export const createProjectModel = async (formData, token) =>{
    const objApi = apiClient('project/models/');
    console.log("formData", formData);
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const getProjectModel = async (token, modelId) => {
    const objApi = apiClient('project/models/'+modelId+'/');
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const updateProjectModel = async (modelId, formData, token) =>{
    const objApi = apiClient('project/models');
    try {
        var response = await objApi.patch(modelId, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteProjectModel = async (token, modelId) => {
    const objApi = apiClient('project/models');
    try {
        var response = await objApi.del(modelId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getProjectStructure = async (token, projectId) => {
    const objApi = apiClient('project/structure/'+projectId+'/');
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}