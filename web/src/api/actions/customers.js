import apiClient from '../client';

export const create = async (formData, token) =>{
    const objApi = apiClient('customer/');
    try {
        var response = await objApi.post(formData, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const getAll = async (token) => {
    const objApi = apiClient('customer?is_active=true');
    try {
        var response = await objApi.get(undefined,token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }
}

export const deleteCustomer = async (token, customerId) => {

    const objApi = apiClient('customer');
    try {
        var response = await objApi.del(customerId, token)
        return response;
    } catch (e) {
        console.log("Error ===>", e)
    }

}