let sectionItem = document.querySelector("#cart__items");
/**
 * Récupère et retourne le contenu du locStorage (JSON.Parse transforme un string en objet JSON)
 * @returns Le contenu du LS
 */
function getLocalStorage() {
    let content = JSON.parse(localStorage.getItem(`product_list`));
    return content;
};
// fillCart sert à remplir la page panier avec les produits ajoutés au LS
function fillCart() {
    let promises = [];
    let tabLStrorage = getLocalStorage();
    for (let product of tabLStrorage) {
        const promise = new Promise(async (resolve) => {
            let monApi = `http://localhost:3000/api/products/${product.id}`; // Car je veux les infos de chaque produit
            const response = await fetch(monApi) // Pour récupérer les autres infos des produits
            const data = await response.json() // Ici mon data est un objet et non un tableau !
            /// Création de la balise article ///
            const article = document.createElement("article");
            article.classList.add("cart__item");
            article.setAttribute("data-id", product.id)
            article.setAttribute("data-color", product.color)
            article.innerHTML = /*HTML */ `
            <div class="cart__item__img">
            <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${product.color}</p>
                    <p>${data.price}</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`
            sectionItem.appendChild(article);
            resolve();
        });
        promises.push(promise)
    }
    return promises;
}

const promises = fillCart();
Promise.all(promises).then(() => { // nous dit quand ttes les promesses sont terminées et lance le .then si c'est le cas
    console.log("La quantité totale est de " + totalQuantity() + " canapé(s)");
    changeQuantity();
    deleteItem()
});

/**
 * Sert à mettre à jour le LS
 * @param {*} key Clé 
 * @param {*} tab Tableau à stocker dans le LS
 */
 function saveBasket(key, tab) {
    localStorage.setItem(key, JSON.stringify(tab))
};

function changeQuantity() {
    let qtyItem = document.querySelectorAll(".itemQuantity");
    qtyItem.forEach(item => {
        item.addEventListener("change", () => {
        console.log("bonjour c la kenti thé");
        })
    })
}

function deleteItem() {
    let deleteBtn = document.querySelectorAll(".deleteItem");
    deleteBtn.forEach(item => { // chaque bouton .deleteItem
        item.addEventListener("click", () => { // au clic
        item.closest("article[data-id]").remove(); // supprimera l'élément le plus proche du bouton qui a article[data-id]
        let tabLStorage = getLocalStorage();
        for (let product of tabLStorage) {
            tabLStorage = tabLStorage.filter(produit => produit.id != product.id)
            saveBasket("product_list", tabLStorage)  
            }   
        })
    })
}

function totalQuantity() {
    let inputsItems = Array.from(document.querySelectorAll(".itemQuantity")); // array.from car de base c'est un HTMLcollection
    let sum = 0;
    inputsItems.forEach(inputItem => {
        let values = parseInt(inputItem.value) // une valeur d'input sera TOUJOURS un string donc faut convertir
        sum += values;
        //Ne surtout pas mettre le console.log ici car il va le faire pour chaque valeur donc 2 fois !
    })
    return sum;
}



// if (element.value) {
//     console.log(element.value);

// function totalQuantity() {
//     totalQuantity = 
// }
// function totalPrice(qtyProduct, priceProduct) {
//     let totalPrice = qtyProduct*priceProduct;
//     return totalPrice
// }

// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()