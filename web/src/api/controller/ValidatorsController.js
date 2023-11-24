import * as validatorActions from '../actions/validators'

export const createValidator = async (formData, token) =>{
    return await validatorActions.createValidator(formData, token).then((response) => {
        return response;
    })
}

export const updateValidator = async (validator_id, formData, token) =>{
    return await validatorActions.updateValidator(validator_id, formData, token).then((response) => {
        return response;
    })
}

export const deleteValidator = async (validator_id, token) =>{
    return await validatorActions.deleteValidator(validator_id, token).then((response) => {
        return response;
    })
}