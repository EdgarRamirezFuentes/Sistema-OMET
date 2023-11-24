import * as projectModels from '../actions/project-model'

export const createProjectModel = async (formData, token) => {
    return await projectModels.createProjectModel(formData, token).then((response) => {
        return response;
    });
}

export const getProjectModel = async (token, projectModelId) => {
    return await projectModels.getProjectModel(token, projectModelId).then((response) => {
        return response;
    })
}

export const getProjectModels = async (token, projectModelId) => {
    return await projectModels.getProjectModel(token, projectModelId).then((response) => {
        return response;
    })
}

export const updateProjectModel = async (projectModelId, formData, token) => {
    return await projectModels.updateProjectModel(projectModelId, formData, token).then((response) => {
        return response;
    })
}

export const deleteProjectModel = async (token, projectModelId) => {
    return await projectModels.deleteProjectModel(token, projectModelId).then((response) => {
        return response;
    })
}