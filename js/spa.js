
const LOGIN = 0,
    SIGNUP = 1,
    STORE = 2;

const spa = {
    pages: document.querySelectorAll("template"),

    init: function () {
        window.addEventListener("popstate", spa.popin);
        spa.addEvents();
        spa.switchPage(LOGIN, true);
    },

    addEvents: function (page) {
        switch (page) {
            case LOGIN:
                let fromLoginToSignup = document.querySelector("#fromLoginToSignup");
                fromLoginToSignup.addEventListener("click", () => spa.switchPage(SIGNUP));

                document.getElementById("loginForm").addEventListener("submit", (event) => {
                    logIn(event);
                });

                break;

            case SIGNUP:
                let fromSignupToLogin = document.querySelector("#fromSignupToLogin");
                fromSignupToLogin.addEventListener("click", () => spa.switchPage(LOGIN));

                document.getElementById("signupForm").addEventListener("submit", (event) => {
                    signUp(event);
                });

                break;

            case STORE:
                document.getElementById("welcomeToStore").innerHTML=`Welcome To ${JSON.parse(localStorage.getItem("currentStore"))}`
                let logOut = document.querySelector("#logOut");
                logOut.addEventListener("click", () => {
                    localStorage.removeItem("currentStore");
                    spa.switchPage(LOGIN);
                });
                /*this.game();*/ client();
                break;
        }
    },
    switchPage: function (index, isFirstPage) {
        this.showPage(index);
        this.addEvents(index);
        let currentPage;
        switch (index) {
            case LOGIN:
                currentPage = "LOGIN";
                break;
            case SIGNUP:
                currentPage = "SIGNUP";
                break;
            case STORE:
                currentPage = "STORE";
                break;
        }
        if (!isFirstPage) history.pushState({}, currentPage, `#${currentPage}`);
        else history.replaceState({}, currentPage, `#${currentPage}`);
    },

    showPage: function (index) {
        document.body.innerHTML = "";
        const clone = this.pages[index].content.cloneNode(true);
        document.body.appendChild(clone);
    },

    popin: function () {
        console.log("popin started");
        let hash = location.hash;
        console.log(location);
        console.log(hash);
        let pageName;
        if (hash == "#LOGIN") pageName = LOGIN;
        else if (hash == "#SIGNUP") pageName = SIGNUP;
        else if (hash == "#STORE") pageName = STORE;

        spa.showPage(pageName);
        spa.addEvents(pageName);
    },
};

document.addEventListener("DOMContentLoaded", spa.init);

/***********************/

function signUp(event) {
    event.preventDefault();

    let addStore = {
        storeName: document.getElementById("signupStoreName").value,
        contactPerson: document.getElementById("signupContactPerson").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value,
        products: [],
    };

    let fxhr = new FXMLHttpRequest();
    fxhr.open("POST", "https://yy-inventory-management-systems.com/api/");
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            localStorage.setItem("currentStore", JSON.stringify(addStore.storeName));
            spa.switchPage(STORE);
        } 
        else
            alert(fxhr.responseText) ;
    });
    fxhr.send(JSON.stringify(addStore));
}

function logIn(event) {
    event.preventDefault();

    let checkStore = {
        storeName: document.getElementById("loginStoreName").value,
        password: document.getElementById("loginPassword").value,
    };

    let fxhr = new FXMLHttpRequest();
    fxhr.open("POST", `https://yy-inventory-management-systems.com/api/?${checkStore.storeName}`);
    fxhr.addEventListener("load", () => {
        if (fxhr.status == 200) {
            localStorage.setItem("currentStore", JSON.stringify(checkStore.storeName));
            spa.switchPage(STORE);
        } 
        else
            alert(fxhr.responseText) ;
    });
    fxhr.send(JSON.stringify(checkStore.password));
}