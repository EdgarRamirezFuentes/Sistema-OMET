import config_env from './config/apiConfig';

var config = config_env.default;
const apiClient = (endpoint) => {
    const customFetch = async (
        url,
        method,
        body = undefined,
        token = undefined,
    ) => {
        const options = {
            method: method,
        };

        if (body != undefined) {
            options.body = JSON.stringify(body);
        }
        if (token) {
            options.headers = { 'Content-Type': 'application/json', 'token': token }

        } else {
            options.headers = { 'Content-Type': 'application/json' }
        }
        return await fetch(config.host + url, options)
            .then(response => {
                return response.json();
            })
            .then(async function (json) {
                return await json;
            })
            .catch(err => {
                console.log(err);
                throw new Error(err);
            });
    };
    const get = (body = undefined, token = undefined) => {
        //var params="";
        //if (!body) throw new Error("to make a get you must provide a body");
        //params = new URLSearchParams(body).toString();
        //const url = `${endpoint}${params ? `?${params}` : ""}`;
        var response = customFetch(endpoint, "GET", body, token);
        return response;
    };
    const post = async (body = undefined, token = undefined) => {
        if (!body) throw new Error("to make a post you must provide a body");
        return await customFetch(endpoint, "POST", body, token);
    };
    const put = (id = false, body = false) => {
        if (!id || !body)
            throw new Error("to make a put you must provide the id and the body");
        const url = `${endpoint}/${id}`;
        return customFetch(url, "PUT", body);
    };
    const del = (id = false) => {
        if (!id)
            throw new Error("to make a delete you must provide the id and the body");
        const url = `${endpoint}/${id}`;
        return customFetch(url, "DELETE");
    };


    return {
        get,
        post,
        put,
        del
    };
};

export default apiClient;