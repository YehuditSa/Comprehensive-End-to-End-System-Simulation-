function server(fxhr, data) {
    requestType = fxhr._requestType;
    url = fxhr._url;
    let splitedUrl = url.split("/");
    let isApi = splitedUrl[3] == "api";
    let s_storeName = splitedUrl[4];
    let s_key = splitedUrl[5];
    try {
        if (!isApi) 
            throw "The request API is not valid.";
        switch (requestType) {
            case "GET":
                if (s_key == "")
                    fxhr.responseText = dataBaseGetAllProducts(s_storeName);
                else if(s_key == "=details")
                    fxhr.responseText = dataBaseGetStoreDetails(s_storeName);
                else if(s_key[0]=="?")
                    fxhr.responseText = dataBaseGetSearch(s_storeName, s_key.slice(1));
                break;
            case "POST":
                if (s_storeName == "") {
                    dataBasePostSetStore(data);
                } 
                else if (s_storeName[0] == "?") {
                    password = dataBasePostCheckValidation(s_storeName.slice(1));
                    checkValidationPassword(password, data);
                } else {
                    dataBasePostSetProduct(s_storeName, data);
                }
                fxhr.responseText = "";
                break;
            case "PUT":
                dataBasePutUpdateProduct(s_storeName, s_key,data);
                fxhr.responseText = "";
                break;
            case "DELETE":
                if (s_key == "") dataBaseDeleteAll(s_storeName);
                else dataBaseDeleteProduct(s_storeName, s_key);
                fxhr.responseText = "";
                break;
            default:
                throw `Method ${requestType} is not allowed Access-Control-Allow-Methods in preflight response.`;
                break;
        }
        fxhr.status = 200;
        fxhr.statusText = "OK";
    } 
    catch (msg) {
        fxhr.responseText = msg;
        fxhr.status = 403;
        fxhr.statusText = "Forbidden";
    } 
    finally {
        fxhr.readyState = LOADING;
        fxhr.responseURL = url;
    }
}
function checkValidationPassword(dbPassword, clientPassword) {
    if(!(dbPassword == JSON.parse(clientPassword)))
        throw "Password isn't Valid";
}
