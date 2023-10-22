import apiClient from '../client';


export const getModelFields = async (project_id, token) =>{
    console.log("token", token);
    const objApi = apiClient('project/fields?app_model_id='+project_id);
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const createModel = async (formData, token) =>{
    const objApi = apiClient('project/fields/');
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const updateModel = async (model_id, formData, token) =>{
    const objApi = apiClient('project/fields');
    try {
        var response = await objApi.patch(model_id, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const deleteModelField = async (field_id, token) =>{
    const objApi = apiClient('project/fields');
    try {
        var response = await objApi.del(field_id, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}