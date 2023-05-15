import * as clientsAction from '../actions/clients'

export const getAllClients = async (token) => {
    return await clientsAction.getAll(token).then((response) => {
        return response;
    });
}

export const resetPassword = async (token, userId) => {
    return await clientsAction.resetPassword(token, userId).then((response) => {
        return response;
    });
}

export const deleteUser = async (token, userId) => {
    return await clientsAction.deleteUser(token, userId).then((response) => {
        return response;
    });
}

export const createClient = async (formData, token) => {
    console.log("====createClient formData====");
    console.log(formData);
    return await clientsAction.create(formData, token).then((response) => {
        console.log("====createClient response====");
        console.log(response);
        return response;
    });
}
