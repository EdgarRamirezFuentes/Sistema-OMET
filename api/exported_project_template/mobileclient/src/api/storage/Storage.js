import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {

    static instance = new Storage();

    store = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    get = async (key) => {
        try {
            return await AsyncStorage.getItem(key).then((response) => {
                return response;
            });
        }
        catch (err) {
            console.log(err);
            throw Error(err)

        }
    }

    remove = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

}
export default Storage;
