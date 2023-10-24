import * as validatorActions from '../actions/validators'

export const createValidator = async (formData, token) =>{
    return await validatorActions.createValidator(formData, token).then((response) => {
        return response;
    })
}