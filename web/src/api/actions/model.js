import apiClient from '../client';


export const getModelFields = async (project_id, token) =>{
    
    const objApi = apiClient('project/fields?app_model_id='+project_id);
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const getModelField = async (project_id, token) =>{
    
    const objApi = apiClient('project/fields/'+project_id);
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const getModels = async (token, app_id) => {
    const objApi = apiClient('project/models?project_app_id='+app_id);
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getModel = async (token, model_id) => {
    console.log("token", token)
    console.log("model_id", model_id)
    const objApi = apiClient('project/models/'+model_id+"/");
    try {
        var response = await objApi.get(undefined, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const create = async (formData, token) =>{
    const objApi = apiClient('project/models/');
    try {
        var response = await objApi.post(formData, token);
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

export const delete_ = async (model_id, token) =>{
    console.log("model_id", model_id);
    const objApi = apiClient('project/models');
    try {
        var response = await objApi.del(model_id, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const filterModelFields = async (token, filterText, app_model_id) =>{
    const objApi = apiClient('project/fields?name='+filterText+ '&app_model_id='+app_model_id);
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}

export const filterModels = async (token, filterText, project_app_id) =>{
    const objApi = apiClient('project/models?model_name='+filterText+'&project_app_id='+project_app_id);
    try {
        var response = await objApi.get(undefined, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}