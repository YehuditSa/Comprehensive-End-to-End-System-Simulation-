function network(fxhr, data) {
    const validUrlBegining = /^(https:\/\/yy-inventory-management-systems.com\/)/;
    if (!validUrlBegining.test(fxhr._url)) {
        throw "not valid URL";
    }
    server(fxhr, data);
    fxhr.readyState = DONE;
    setTimeout( fxhr.fireEvent("load"),0);
}
