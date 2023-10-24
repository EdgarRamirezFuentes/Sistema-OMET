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

export const getProject = async (token, projectId) => {
    return await projectsAction.getProject(token, projectId).then((response) => {
        return response;
    })
}

export const updateProject = async (projectId, formData, token) => {
    return await projectsAction.updateProject(projectId, formData, token).then((response) => {
        return response;
    })
}

export const deleteProject = async (token, projectId) => {
    return await projectsAction.deleteProject(token, projectId).then((response) => {
        return response;
    })
}

export const createProjectMaintenance = async (formData, token) => {
    return await projectsAction.createProjectMaintenance(formData, token).then((response) => {
        return response;
    })
}

export const deleteProjectMaintenance = async (maintenanceId, token) => {
    return await projectsAction.deleteProjectMaintenance(token, maintenanceId).then((response) => {
        return response;
    })
}

export const getProjectStructure = async (token, projectId) => {
    return await projectsAction.getProjectStructure(token, projectId).then((response) => {
        return response;
    })
}


