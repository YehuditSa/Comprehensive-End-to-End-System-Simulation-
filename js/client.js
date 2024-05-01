
function client() {
    showAllProducts();
    showStoreDetails();
    const addProductWindow = document.querySelector("#addProductWindow");
    const updateProductWindow = document.querySelector("#updateProductWindow");
    const addProductForm = document.querySelector("#addProductForm");
    const addXBtn = document.querySelector("#addX");
    const updateProductXBtn = document.querySelector("#updateX");
    const addProductBtn = document.querySelector("#addProduct");
    const deleteAllBtn = document.querySelector("#deleteAll");
    const searchForm = document.querySelector("#search");
    const showAllProductsBtn = document.querySelector("#showAllProducts");

    addXBtn.addEventListener("click", () => {
        addProductWindow.style.display = "none";
    });

    addProductBtn.addEventListener("click", () => {
        addProductWindow.style.display = "block";
    });

    addProductForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addProduct();
    });

    updateProductXBtn.addEventListener("click", () => {
        updateProductWindow.style.display = "none";
    });

    deleteAllBtn.addEventListener("click", () => {
        deleteAll();
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let key = document.getElementById("navSearch").value;
        search(key);
        searchForm.reset();
    })

    showAllProductsBtn.addEventListener("click", () => {
        showAllProducts();
    })
}

function showAllProducts() {
    let fxhr = new FXMLHttpRequest();
    fxhr.open("GET", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/`);
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            document.querySelector("table tbody").innerHTML = "";
            let products = fxhr.responseText;
            products.forEach((product) => {
                product = JSON.parse(product);
                addProductToClient(product);
            });
        }
    });
    fxhr.send();
}

function showStoreDetails() {
    let fxhr = new FXMLHttpRequest();
    fxhr.open("GET", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/=details`);
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            let details = JSON.parse(fxhr.responseText);
            document.getElementById("wStoreEmail").innerText += " " + details.email;
            document.getElementById("wStoreContactPerson").innerText += " " + details.contactPerson;
        }
    });
    fxhr.send();
}

function addProduct() {
    let product = {
        name: document.getElementById("addName").value,
        barcode: document.getElementById("addBarcode").value,
        amount: document.getElementById("addAmount").value,
        price: document.getElementById("addPrice").value,
    };
    document.getElementById("addProductForm").reset();

    let fxhr = new FXMLHttpRequest();
    fxhr.open("POST", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/`);
    fxhr.onload(() => {
        if (fxhr.status == 200) {
            addProductToClient(product);
        } 
        else {
            alert(fxhr.responseText);
        }
    });
    fxhr.send(JSON.stringify(product));
}

function updateProduct(barcode) {
    let product = {
        name: document.getElementById("updateName").value,
        amount: document.getElementById("updateAmount").value,
        price: document.getElementById("updatePrice").value,
    };

    let fxhr = new FXMLHttpRequest();
    fxhr.open("PUT", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/${barcode}`);
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            document.querySelector("#updateProductWindow").style.display = "none";
            updateProductInClient(product, barcode);
        } else alert(fxhr.responseText);
    });
    fxhr.send(JSON.stringify(product));
}

function deleteAll() {
    if (confirm("Are You Sure that You Want to Delete all Products?")) {
        let fxhr = new FXMLHttpRequest();
        fxhr.open("DELETE", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/`);
        fxhr.addEventListener("load", () => {
            if (fxhr.status == 200) {
                document.querySelector("table tbody").innerHTML = "";
            } 
            else 
                alert(fxhr.responseText);
        });
        fxhr.send();
    }
}

function deleteProduct(barcode) {
    if (confirm(`Are You Sure that You Want to Delete Product ${barcode}?`)) {
        let fxhr = new FXMLHttpRequest();
        fxhr.open("DELETE", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/${barcode}`);
        fxhr.addEventListener("load", () => {
            if (fxhr.status == 200) {
                let rowForRemove = document.querySelector(`#tr${barcode}`);
                rowForRemove.remove();
            } 
            else 
                alert(fxhr.responseText);
        });
        fxhr.send();
    }
}

function addProductToClient(product) {
    const bodyTable = document.querySelector("table tbody");
    addProductWindow.style.display = "none";
    let newRow = `<tr id="tr${product.barcode}"> <td>${product.name}</td> <td>${product.barcode}</td> <td>${product.amount}</td> <td>${product.price}</td>
     <td><button id="updateProduct${product.barcode}">✏️</button></td><td>
     <button id="deleteProduct${product.barcode}">🗑️</button></td></tr>`;
    bodyTable.insertAdjacentHTML("beforeend", newRow);
    addEventsToProduct(product.barcode);
}


function addEventsToProduct(barcode) {
    let updateProductBtn = document.querySelector(`#updateProduct${barcode}`);
    let deleteProductBtn = document.querySelector(`#deleteProduct${barcode}`);
    updateProductBtn.addEventListener("click", () => {

        document.querySelector("#updateProductWindow").style.display = "block";
        updateProductForm.addEventListener("submit", (event) => {
            event.preventDefault();
            updateProduct(barcode);
        },{once : true})

        let currentProductData = document.querySelectorAll(`#tr${barcode} td`);
        document.getElementById("updateName").value = currentProductData[0].innerHTML;
        document.getElementById("updateAmount").value = currentProductData[2].innerHTML;
        document.getElementById("updatePrice").value = currentProductData[3].innerHTML;
    });

    deleteProductBtn.addEventListener("click", () => {
        deleteProduct(barcode);
    });
}

function updateProductInClient(product, barcode) {
    let currentProductData = document.querySelectorAll(`#tr${barcode} td`);
    currentProductData[0].innerText=product.name;
    currentProductData[2].innerText=product.amount;
    currentProductData[3].innerText=product.price;
}

function search(key) {
    let fxhr = new FXMLHttpRequest();
    fxhr.open("GET", `https://yy-inventory-management-systems.com/api/${JSON.parse(localStorage.getItem("currentStore"))}/?${key}`);
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            document.querySelector("table tbody").innerHTML="";
            let products = JSON.parse(fxhr.responseText);
            products.forEach((product) => {
                addProductToClient(product);
            });
        }
        else
            alert(fxhr.responseText);
    });
    fxhr.send();
}