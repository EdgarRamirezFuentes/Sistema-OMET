import apiClient from '../client';

export const exportProject = async (project_id, token) =>{
    const objApi = apiClient('project/export/'+project_id+'/');
    try {
        var response = await objApi.post({}, token);
        return response;
    } catch (e) {
        console.log("Error ===>", e);
    }
}