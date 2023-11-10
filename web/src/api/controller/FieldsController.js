import * as projectFields from '../actions/fields'

export const createProjectFields = async (formData, token) => {
    return await projectFields.createProjectField(formData, token).then((response) => {
        return response;
    });
}

export const getProjectFields = async (token, projectFieldId) => {
    return await projectFields.getProjectField(token, projectFieldId).then((response) => {
        return response;
    })
}

export const updateProjectField = async (projectFieldId, formData, token) => {
    return await projectFields.updateProjectField(projectFieldId, formData, token).then((response) => {
        return response;
    })
}

export const deleteProjectField = async (token, projectFieldId) => {
    return await projectFields.deleteProjectField(token, projectFieldId).then((response) => {
        return response;
    })
}