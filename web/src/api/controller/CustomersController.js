import * as customersActions from '../actions/customers'

export const createCustomer = async (formData, token) => {
    return await customersActions.create(formData, token).then((response) => {
        return response;
    });
}

export const getCustomers = async (token) => {
    return await customersActions.getAll(token).then((response) => {
        return response;
    })
}

export const deleteCustomer = async (token, customerId) => {
    return await customersActions.deleteCustomer(token, customerId).then((response) => {
        return response;
    })
}