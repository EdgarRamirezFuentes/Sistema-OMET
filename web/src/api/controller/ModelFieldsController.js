import * as modelActions from '../actions/model'

export const getModelFields = async (project_id, token) =>{
    return await modelActions.getModelFields(token, modelId).then((response) => {
        return response;
    })
}