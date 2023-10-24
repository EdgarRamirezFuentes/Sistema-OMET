import apiClient from '../client';


export const createValidator = async (formData, token) =>{
    const objApi = apiClient('project/validator-value/');
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