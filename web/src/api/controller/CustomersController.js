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

export const getCustomer = async (token, customerId) => {
    return await customersActions.getCustomer(token, customerId).then((response) => {
        return response;
    })
}

export const updateCustomer = async (formData, token, customerId) => {
    return await customersActions.updateCustomer(formData, token, customerId).then(async (response) => {
        return response;
    })
}

export const deleteCustomer = async (token, customerId) => {
    return await customersActions.deleteCustomer(token, customerId).then((response) => {
        return response;
    })
}

export const filterCustomers = async (token, filter) => {
    return await customersActions.filterCustomers(token, filter).then((response) => {
        return response;
    })
}