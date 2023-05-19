import * as projectsAction from '../actions/projects'

export const createProject = async (formData, token) => {
    return await projectsAction.create(formData, token).then((response) => {
        return response;
    });
}

export const getAllProjects = async (token) => {
    return await projectsAction.getAllProjects(token).then((response) => {
        return response;
    })  
}

export const deleteProject = async (token, projectId) => {
    return await projectsAction.deleteProject(token, projectId).then((response) => {
        return response;
    })
}