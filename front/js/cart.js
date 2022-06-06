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
    let arrayLS = getLocalStorage();
    for (let product of arrayLS) {
        const promise = new Promise(async (resolve) => { // Y a autant de promesses que de produits
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
    deleteItem();
    totalQuantity();
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
    let qtyInputs = document.querySelectorAll(".itemQuantity");
    qtyInputs.forEach(inputItem => {
        inputItem.addEventListener("change", () => {
        let itemQty = inputItem.value;
        let arrayLS = getLocalStorage();
        let prodID = inputItem.closest("article").dataset.id; // stock l'id de l'article le plus proche
        let prodColor = inputItem.closest("article").dataset.color;
        const element = arrayLS.find(produit => produit.id == prodID && produit.color == prodColor); 
        let indexItem = arrayLS.indexOf(element)
        arrayLS[indexItem].qty = itemQty;
        saveBasket("product_list", arrayLS);
        })
    })
}

function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach(button => { // chaque bouton .deleteItem
        button.addEventListener("click", () => { // au clic
        let prodID = button.closest("article").dataset.id; // stock l'id de l'article le plus proche
        let prodColor = button.closest("article").dataset.color;
        button.closest("article").remove(); // supprimera l'élément le plus proche du bouton qui a article[data-id]
        let arrayLS = getLocalStorage();
        const element = arrayLS.find(produit => produit.id == prodID && produit.color == prodColor); 
        arrayLS.splice(arrayLS.indexOf(element), 1); // a partir de l'index arrayLS.indexOf(element), sélectionne 1 index (donc lui-même)
        saveBasket("product_list", arrayLS)  
        })
    })
}




function totalQuantity() {
    let inputsItems = Array.from(document.querySelectorAll(".itemQuantity")); // array.from car de base c'est un HTMLcollection
    let sum = 0;
    inputsItems.forEach(inputItem => {
        let values = parseInt(inputItem.value) // une valeur d'input sera TOUJOURS un string donc faut convertir
        sum += values;
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