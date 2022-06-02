let sectionItem = document.querySelector("#cart__items");

// Je récupère le contenu de mon localStorage
function getLocalStorage() {
    let content = JSON.parse(localStorage.getItem(`product_list`)); // JSON.Parse transforme un string en objet JSON
    return content;
};
// fillCart sert à remplir la page panier avec les produits ajoutés au panier
function fillCart() {
    let promises = [];
    let tabLStrorage = getLocalStorage();
    for (let product of tabLStrorage) {
        const promise = new Promise(async(resolve) => {
            /// Création de la balise article ///
            const article = document.createElement("article");
            article.classList.add("cart__item");
            article.setAttribute("data-id", product.id)
            article.setAttribute("data-color", product.color)
            sectionItem.appendChild(article);
            /// Fin - Création de la balise article ///
            let monApi = `http://localhost:3000/api/products/${product.id}`; // Car je veux les infos de chaque produit individuellement
            const response = await fetch(monApi) // Pour récupérer les autres informatiques des produits 
            const data = await response.json() // Ici mon data est un objet et non un tableau !
            /// Div cart__item__img ///
            const divCartItemImg = document.createElement("div");
            divCartItemImg.classList.add("cart__item__img");
            const imgProduct = document.createElement("img");
            imgProduct.setAttribute("src", `${data.imageUrl}`);
            imgProduct.setAttribute("alt", `${data.altTxt}`);
            /// Fin - Div cart__item__img ///
            /// Div cart__item__content ///
            const divCartItemContent = document.createElement("div");
            divCartItemContent.classList.add("cart__item__content");
            const divCartItemDescp = document.createElement("div");
            divCartItemDescp.classList.add("cart__item__content__description");
            const nameProduct = document.createElement("h2");
            nameProduct.innerText = data.name
            const colorProduct = document.createElement("p");
            colorProduct.innerText = product.color
            const priceProduct = document.createElement("p");
            priceProduct.innerText = data.price + "€";
            /// Fin - Div cart__item__content ///
            /// Div cart__item__content__settings ///
            const divSettings = document.createElement("div");
            divSettings.classList.add("cart__item__content__settings");
            const divSettingsQty = document.createElement("div");
            divSettingsQty.classList.add("cart__item__content__settings__quantity");
            const productQty = document.createElement("p");
            productQty.innerText = "Qté : "
            const inputQty = document.createElement("input");
            inputQty.classList.add("itemQuantity");
            inputQty.setAttribute("type", "number");
            inputQty.setAttribute("name", data.name);
            inputQty.setAttribute("min", "1");
            inputQty.setAttribute("max", "100");
            inputQty.setAttribute("value", product.qty);
            const divDelete = document.createElement("div");
            divDelete.classList.add("cart__item__content__settings__delete");
            const pDelete = document.createElement("p");
            pDelete.classList.add("deleteItem");
            pDelete.innerText = "Supprimer"
            /// Fin - Div cart__item__content__settings ///
            article.appendChild(divCartItemImg);
            divCartItemImg.appendChild(imgProduct);
            article.appendChild(divCartItemContent);
            divCartItemContent.appendChild(divCartItemDescp);
            divCartItemDescp.appendChild(nameProduct);
            divCartItemDescp.appendChild(colorProduct);
            divCartItemDescp.appendChild(priceProduct);
            article.appendChild(divSettings);
            divSettings.appendChild(divSettingsQty);
            divSettingsQty.appendChild(productQty);
            divSettingsQty.appendChild(inputQty);
            divSettings.appendChild(divDelete);
            divDelete.appendChild(pDelete);
            resolve();
        });
        promises.push(promise)
    }
    return promises;
}

const promises = fillCart();
Promise.all(promises).then(() => { // nous dit quand ttes les promesses sont terminées et lance le .then si c'est le cas
    console.log(document.getElementsByClassName("itemQuantity"));
    let input = Array.from(document.querySelectorAll(".itemQuantity"));
    console.log(input);
})





function consoleItem(item) {
    // console.log(item);
}
// input.addEventListener("change", function() {
//     console.log("coucou");
//     })




// let article = document.querySelector(".cart__item");
// console.log("Avec dataset : " + article.dataset.id);



// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()


// mélanger createElement (sur l'élément parent) avec innerHTML (pour remplir le parent) 