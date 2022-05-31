let monApi = "http://localhost:3000/api/products/";
let sectionItem = document.querySelector("#cart__items");

// Je récupère le contenu de mon localStorage
function getLocalStorage() {
    let content = JSON.parse(localStorage.getItem(`product_list`)); // JSON.Parse transforme un string en objet JSON
    return content;
};



function fillCart() {
    let tabLStrorage = getLocalStorage();
    for (let product of tabLStrorage) {
        console.log(product);
        sectionItem.innerHTML = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}"></article>`; // à vérifier sur l'HTML du panier depuis l'inspecteur
    }
    fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        let article = document.querySelector("#section > article");
        article.innerHTML = `<div class="cart__item__img"><img src="${data.imageUrl}" alt="Photographie d'un canapé"></div>`
    })
}

fillCart();

// let article = document.querySelector(".cart__item");
// console.log("Avec dataset : " + article.dataset.id);

