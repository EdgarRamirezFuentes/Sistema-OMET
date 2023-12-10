import Storage from './Storage';
const KEY = "tokenSession";
class SessionStorage {

    static instance = new SessionStorage();

    async getTokenSession() {
        return await Storage.instance.get(KEY).then((response) => {
            if (response == null) {
                return false;
            } else {
                return response;
            }
        });
    }

    async setTokenSession(token) {
        await Storage.instance.store(KEY, token).then((response) => {
            return response;
        });
    }

    async removeSession() {
        return await Storage.instance.remove(KEY).then((response) => {
            return response;
        });
    }



}

export default SessionStorage;