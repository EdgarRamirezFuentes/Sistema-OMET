import apiClient from '../client';

export const create = async (formData, token) =>{
    const objApi = apiClient('data-type/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getInputTypes = async (token) =>{
    const objApi = apiClient('data-type/input-types/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    }catch (e) {
        console.log("Error ===>", e)
    }
}

export const getDataType = async (id, token) =>{
    const objApi = apiClient('data-type/'+id+'/');
    try {
        var response = await objApi.get(undefined, token)
        return response;
    }catch (e) {
        console.log("Error ===>", e)
    }
}

export const getDataTypes = async (token) =>{
    const objApi = apiClient('data-type?is_active=true');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    }catch (e) {
        console.log("Error ===>", e)
    }
}

export const updateDataType = async (id, formData, token) =>{
    const objApi = apiClient('data-type');
    try {
        var response = await objApi.patch(id, formData, token)
        return response;
    }catch (e) {
        console.log("Error ===>", e)
    }
}

export const deleteDataType = async (id, token) =>{
    const objApi = apiClient('data-type');
    try {
        var response = await objApi.del(id,token)
        return response;
    }catch (e) {
        console.log("Error ===>", e)
    }
}