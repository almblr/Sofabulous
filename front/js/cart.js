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
                        <p>${data.price}€</p>
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

Promise.all(promises).then(() => { // Return .then si ttes les promesses sont réussies/terminées
    console.log("La quantité totale est de " + totalQuantity() + " canapé(s)");
    changeQuantity();
    deleteItem();
    totalQuantity();
    console.log(totalPrice());
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
    let allQtyInputs = document.querySelectorAll(".itemQuantity");
    allQtyInputs.forEach(itemInput => { // pour chaque input parmi allQtyInputs
        itemInput.addEventListener("change", () => {
        let arrayLS = getLocalStorage();
        let itemQty = itemInput.value;
        let itemID = itemInput.closest("article").dataset.id; // get dataset.id of the closest <article>
        let itemColor = itemInput.closest("article").dataset.color; // idem for color
        let element = arrayLS.find(product => product.id == itemID && product.color == itemColor); 
        let indexItem = arrayLS.indexOf(element)
        arrayLS[indexItem].qty = itemQty;
        saveBasket("product_list", arrayLS);
        })
    })
}

function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach(button => { // pour chaque bouton parmi deleteButtons
        button.addEventListener("click", () => {
        let itemID = button.closest("article").dataset.id; 
        let itemColor = button.closest("article").dataset.color;
        button.closest("article").remove(); // delete the closest <article> (dom only)
        // Suppression au niveau du local storage
        let arrayLS = getLocalStorage();
        let element = arrayLS.find(product => product.id == itemID && product.color == itemColor); 
        let productIdx = arrayLS.indexOf(element) // Get l'index du produit en question
        arrayLS.splice(productIdx, 1); // Select one element from productIdx & delete it (donc lui-même)
        saveBasket("product_list", arrayLS)  
        })
    })
}

function totalPrice() {
    return itemPrice = document.querySelector(".cart__item__content__description >:nth-child(3)").textContent.replace("€","")
}


function totalQuantity() {
    let arrayLS = getLocalStorage();
    return arrayLS.map(item => parseInt(item.qty)).reduce((acc, i) => acc + i);
}


// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()