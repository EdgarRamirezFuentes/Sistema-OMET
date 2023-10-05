import { loginUser } from '../../api/controller/LoginController'
class LoginManager {

    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new LoginManager();
        }
        return this.myInstance;
    }

    async loginUser(email, password) {
        await loginUser(email, password).then(async (res) => {
            console.log(res)
        }).catch((e) => {
            console.log("Catch", e);
        });
    }


}

export default LoginManager;