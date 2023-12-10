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
            options.headers = { 'Content-Type': 'application/json', 'Authorization': 'Token '+token }

        } else {
            options.headers = { 'Content-Type': 'application/json' }
        }
        return await fetch(config.host + url, options)
            .then(response => {
                return response
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

    const put = async (id = false, body = undefined, token = undefined) => {
        if (!id || !body)
            throw new Error("to make a put you must provide the id and the body");
        const url = `${endpoint}/${id}/`;
        return await customFetch(url, "PUT", body, token);
    };
    
    const patch = async (id = undefined, body = undefined, token = undefined) => {
        console.log("patch", id, body, token);
        if (!body)
            throw new Error("to make a patch you must provide the body");
        let url = ""
        if (id == undefined){
            url = `${endpoint}`;
        }
        else{
            url = `${endpoint}${id}/`;
        }
        return  customFetch(url, "PATCH", body, token);
    };

    const del = async (id = false, token = undefined) => {
        if (!id)
            throw new Error("to make a delete you must provide the id and the body");
        const url = `${endpoint}${id}/`;
        return await customFetch(url, "DELETE", undefined, token);
    };


    return {
        get,
        post,
        put,
        patch,
        del
    };
};

export default apiClient;