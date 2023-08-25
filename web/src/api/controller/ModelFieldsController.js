import * as modelActions from '../actions/model'

export const getModelFields = async (project_id, token) =>{
    return await modelActions.getModelFields(project_id, token).then((response) => {
        return response;
    })
}

export const createModel = async (formData, token) =>{
    return await modelActions.createModel(formData, token).then((response) => {
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