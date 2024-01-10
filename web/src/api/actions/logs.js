import apiClient from '../client';

export const getCustomerCreateLogs = async (token) => {
    const objApi = apiClient('logs/customer/create/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getCustomerUpdateLogs = async (token) =>{
    const objApi = apiClient('logs/customer/update/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }   
}

export const getProjectCreateLogs = async (token) =>{
    const objApi = apiClient('logs/project/create/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }   
}

export const getProjectUpdateLogs = async (token) =>{
    const objApi = apiClient('logs/project/update/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }   
}

export const getUserCreateLogs = async (token) =>{
    const objApi = apiClient('logs/user/create/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }   
}

export const getUserUpdateLogs = async (token) =>{
    const objApi = apiClient('logs/user/update/');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }   
}