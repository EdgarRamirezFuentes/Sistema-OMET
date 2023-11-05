import * as appActions from '../actions/app'

export const createApp = async (formData, token) =>{
    return await appActions.createApp(formData, token).then((response) => {
        return response;
    })
}

export const getApps = async (project_id, token) =>{
    return await appActions.getApps(project_id, token).then((response) => {
        return response;
    })
}

export const updateApp = async (app_id, formData, token) =>{
    return await appActions.updateApp(app_id, formData, token).then((response) => {
        return response;
    })
}

export const deleteApp = async (app_id, token) =>{
    return await appActions.deleteApp(app_id, token).then((response) => {
        return response;
    })
}