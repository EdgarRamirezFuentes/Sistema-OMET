import * as loginAction from '../actions/login'

export const loginUser = async (email, password) => {
    return await loginAction.login(email, password).then((response) => {
        return response;
    });
}
