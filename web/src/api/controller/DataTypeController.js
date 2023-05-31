import * as dataTypeActions from '../actions/datatype'


export const createDataType = async (formData, token) => {
    return await dataTypeActions.create(formData, token).then((response) => {
        return response;
    });
}

export const getInputTypes = async (token) => {
    return await dataTypeActions.getInputTypes(token).then((response) => {
        return response;
    });
}

export const getDataType = async (id, token) => {
    return await dataTypeActions.getDataType(id, token).then((response) => {
        return response;
    });
}

export const getDataTypes = async (token) => {
    return await dataTypeActions.getDataTypes(token).then((response) => {
        return response;
    });
}

export const updateDataType = async (id, formData, token) => {
    return await dataTypeActions.updateDataType(id, formData, token).then((response) => {
        return response;
    });
}

export const deleteDataType = async (id, token) => {
    return await dataTypeActions.deleteDataType(id, token).then((response) => {
        return response;
    });
}