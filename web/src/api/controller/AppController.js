import * as appActions from '../actions/app'

export const getApps = async (project_id, token) =>{
    return await appActions.getApps(project_id, token).then((response) => {
        return response;
    })
}

export const createApp = async (formData, token) =>{
    return await appActions.createApp(formData, token).then((response) => {
        return response;
    })
}

export const updateApp = async (model_id, formData, token) =>{
    return await appActions.updateApp(model_id, formData, token).then((response) => {
        return response;
    })
}

export const deleteApp = async (field_id, token) =>{
    return await appActions.deleteApp(field_id, token).then((response) => {
        return response;
    })
}