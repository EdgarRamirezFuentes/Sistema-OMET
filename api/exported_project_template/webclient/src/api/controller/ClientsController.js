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
    return await clientsAction.create(formData, token).then((response) => {
        return response;
    });
}

export const getClient = async (token, userId) => {
    return await clientsAction.getClient(token, userId).then((response) => {
        return response;
    });
}

export const updateClient = async (formData, token, userId) => {
    return await clientsAction.updateClient(formData, token, userId).then(async (response) => {
        return response;
    });
}

export const changePassword = async (formData, token) => {

    return await clientsAction.changePassword(formData, token).then((response) => {
        return response;
    });
}

export const getCustomers = async (token) => {
    return await clientsAction.getCustomers(token).then((response) => {
        return response;
    })
}