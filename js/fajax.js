const UNSENT = 0,
    OPENED = 1,
    HEADERS_RECIEVED = 2,
    LOADING = 3,
    DONE = 4;

class FXMLHttpRequest extends customObject {
    constructor() {
        super();
        this.readyState = UNSENT;
        this.responseText = "";
        this.responseURL = "";
        this.status = 0;
        this.statusText = "";
        this._requestType = "";
        this._url = "";
    }

    open(requestType, url, isAsynchrony = true) {
        this._requestType = requestType;
        this._url = url;
        this.readyState = OPENED;
    }


    send(data = JSON.stringify("")) {
        this.readyState = HEADERS_RECIEVED;
        network(this, data);
    }

    onload(func) {
        this.addEventListener("load", func);
    }
}
