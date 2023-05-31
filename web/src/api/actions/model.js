import apiClient from '../client';


export const getModelFields = async (project_id, token) =>{
    const objApi = apiClient('project/fields/?project_id=1');
    try {
        var response = await objApi.post(formData, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}