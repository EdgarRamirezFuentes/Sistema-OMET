import * as logsAction from '../actions/logs'

export const getCustomerCreateLogs = async (token) => {
    return await logsAction.getCustomerCreateLogs(token).then((response) => {
        return response;
    });
}

export const getCustomerUpdateLogs = async (token) => {
    return await logsAction.getCustomerUpdateLogs(token).then((response) => {
        return response;
    });
}

export const getProjectCreateLogs = async (token) => {
    return await logsAction.getProjectCreateLogs(token).then((response) => {
        return response;
    });
}

export const getProjectUpdateLogs = async (token) => {
    return await logsAction.getProjectUpdateLogs(token).then((response) => {
        return response;
    });
}

export const getUserCreateLogs = async (token) => {
    return await logsAction.getUserCreateLogs(token).then((response) => {
        return response;
    });
}

export const getUserUpdateLogs = async (token) => {
    return await logsAction.getUserUpdateLogs(token).then((response) => {
        return response;
    });
}