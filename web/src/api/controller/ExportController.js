import * as exportActions from '../actions/export'


export const exportProject = async (project_id, token) =>{
    return await exportActions.exportProject(project_id, token).then((response) => {
        return response;
    })
}