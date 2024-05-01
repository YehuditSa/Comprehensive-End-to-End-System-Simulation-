function dataBaseGetAllProducts(storeName) {
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    return dataOfStoreFromLS.products;
}

function dataBaseGetStoreDetails(storeName) {
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    let details = {
        email: dataOfStoreFromLS.email,
        contactPerson: dataOfStoreFromLS.contactPerson,
    };
    return JSON.stringify(details);
}

function dataBaseGetSearch(storeName, key) {
    let isFound = false;
    let foundProducts = [];
    let searchType;
    let letters = /^[A-Za-z]*$/;
    let numbers = /^[0-9]*$/;
    if (letters.test(key)) searchType = "name";
    else if (numbers.test(key)) searchType = "barcode";
    else throw "Key For Search isn't valid";

    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    let length = dataOfStoreFromLS.products.length;

    for (let i = 0; i < length; i++) {
        if (JSON.parse(dataOfStoreFromLS.products[i])[searchType] == key) {
            isFound = true;
            foundProducts.push(JSON.parse(dataOfStoreFromLS.products[i]));
            if (searchType == "barcode") break;
        }
    }

    if (!isFound) throw `The reqiered product isn't Exist`;

    return JSON.stringify(foundProducts);
}

function dataBasePostSetStore(data) {
    let recievedData = JSON.parse(data);
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == recievedData.storeName) {
            throw "Store is Already Exists";
        }
    }
    localStorage.setItem(recievedData.storeName, data);
}

function dataBasePostSetProduct(storeName, data) {
    let recievedData = JSON.parse(data);
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    dataOfStoreFromLS.products.forEach((product) => {
        if (JSON.parse(product).barcode == recievedData.barcode) throw "Product Already Exists";
    });
    dataOfStoreFromLS.products[dataOfStoreFromLS.products.length] = data;
    localStorage.setItem(storeName, JSON.stringify(dataOfStoreFromLS));
}

function dataBasePostCheckValidation(storeName) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == storeName) {
            return JSON.parse(localStorage.getItem(storeName)).password;
        }
    }

    throw "Store isn't Exists";
}

function dataBasePutUpdateProduct(storeName, key, data) {
    let isUpdated = false;
    let recievedData = JSON.parse(data);
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    let length = dataOfStoreFromLS.products.length;
    for (let i = 0; i < length; i++) {
        if (JSON.parse(dataOfStoreFromLS.products[i]).barcode == key) {
            isUpdated = true;
            dataOfStoreFromLS.products[i] = JSON.parse(dataOfStoreFromLS.products[i]);
            dataOfStoreFromLS.products[i].name = recievedData.name;
            dataOfStoreFromLS.products[i].amount = recievedData.amount;
            dataOfStoreFromLS.products[i].price = recievedData.price;
            dataOfStoreFromLS.products[i] = JSON.stringify(dataOfStoreFromLS.products[i]);
        }
    }
    if (!isUpdated) throw "The Product is not Exist";
    localStorage.setItem(storeName, JSON.stringify(dataOfStoreFromLS));
}

function dataBaseDeleteAll(storeName) {
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    dataOfStoreFromLS.products = [];
    localStorage.setItem(storeName, JSON.stringify(dataOfStoreFromLS));
}

function dataBaseDeleteProduct(storeName, barcode) {
    let isDeleted = false;
    let dataOfStoreFromLS = JSON.parse(localStorage.getItem(storeName));
    let length = dataOfStoreFromLS.products.length;
    for (let i = 0; i < length; i++) {
        if (JSON.parse(dataOfStoreFromLS.products[i]).barcode == barcode) {
            dataOfStoreFromLS.products.splice(i, 1);
            isDeleted = true;
            break;
        }
    }
    if (!isDeleted) throw "The Product is not Exist";
    localStorage.setItem(storeName, JSON.stringify(dataOfStoreFromLS));
}
