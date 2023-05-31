import apiClient from '../client';

export const create = async (formData, token) =>{
    const objApi = apiClient('project/maintenance/');
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}