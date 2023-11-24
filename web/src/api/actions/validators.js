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

export const updateValidator = async (validator_id, formData, token) =>{
    const objApi = apiClient('project/validator-value');
    try {
        var response = await objApi.patch(validator_id, formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }

}

export const deleteValidator = async (validator_id, token) =>{
    const objApi = apiClient('project/validator-value');
    try {
        var response = await objApi.del(validator_id, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}