import * as modelActions from '../actions/model'

export const getModelFields = async (project_id, token) =>{
    return await modelActions.getModelFields(project_id, token).then((response) => {
        return response;
    })
}

export const getModels = async (app_id, token) => {
    return await modelActions.getModels(token, app_id).then((response) => {
        return response;
    })

}

export const getModel = async (app_id, token) => {
    return await modelActions.getModel(token, app_id).then((response) => {
        return response;
    })

}

export const getModelField = async (project_id, token) =>{
    return await modelActions.getModelField(project_id, token).then((response) => {
        return response;
    })
}

export const createModel = async (formData, token) =>{
    return await modelActions.createModel(formData, token).then((response) => {
        return response;
    })
}

export const create = async (formData, token) =>{
    return await modelActions.create(formData, token).then((response) => {
        return response;
    })
}

export const updateModel = async (model_id, formData, token) =>{
    return await modelActions.updateModel(model_id, formData, token).then((response) => {
        return response;
    })
}

export const deleteModelField = async (field_id, token) =>{
    return await modelActions.deleteModelField(field_id, token).then((response) => {
        return response;
    })
}

export const delete_ = async (model_id, token) =>{
    return await modelActions.delete_(model_id, token).then((response) => {
        return response;
    })
}