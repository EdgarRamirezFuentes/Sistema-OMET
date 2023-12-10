import SessionStorage from '../storage/SessionStorage'

class SessionManager {

    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new SessionManager();
        }
        return this.myInstance;
    }

    async setTokenSession(token) {
        return await SessionStorage.instance.setTokenSession(token).then((response) => {
            return response;
        });
    }

    async hasSession() {
        return await SessionStorage.instance.getTokenSession().then(async (response) => {
            if (response != null && response) {
                return await validateSession(response).then(async (res) => {
                    if (res != null) {
                        if (!res.success) {
                            this.logOut();
                            await FirebaseStorage.instance.removeDataFirebase();
                        } else {
                            return (res.session.token);
                        }
                    }
                })
            } else {
                return false;
            }
        })
    }

    async getTokenSession() {
        return await SessionStorage.instance.getTokenSession().then((response) => {
            return response;
        })
    }

    async logOut() {
        return await SessionStorage.instance.removeSession().then((response) => {
            return response;
        });
    }


}

export default SessionManager;
