let sectionItem = document.querySelector("#cart__items");
let contentLS = JSON.parse(localStorage.getItem(`product_list`));

// fillCart sert à remplir la page panier avec les produits ajoutés au LS
function fillCart() {
    let promises = [];
    for (let product of contentLS) {
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
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

const promises = fillCart();
Promise.all(promises).then(() => { // Return .then si ttes les promesses sont réussies/terminées
    console.log("La quantité totale est de " + getTotalQuantity(contentLS) + " canapé(s)");
    changeQuantity();
    deleteItem();
    console.log("Le prix total est de : " + getTotalPrice());
});

function saveBasket(key, tab) {
    localStorage.setItem(key, JSON.stringify(tab))
};

function getIndexProduct(item, LS) {
    let contentLS = LS;
    let itemID = item.closest("article").dataset.id; // get dataset.id of the closest <article>
    let itemColor = item.closest("article").dataset.color; // idem for color
    let element = contentLS.find(product => product.id == itemID && product.color == itemColor);
    let productIdx = contentLS.indexOf(element) // Get l'index du produit en question
    return productIdx;
}

function changeQuantity() {
    let allQtyInputs = document.querySelectorAll(".itemQuantity");
    allQtyInputs.forEach(itemInput => { // pour chaque input parmi allQtyInputs
        itemInput.addEventListener("change", () => {
            let itemQty = itemInput.value;
            contentLS[getIndexProduct(itemInput, contentLS)].qty = itemQty;
            saveBasket("product_list", contentLS);
        })
    })
}

function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            let itemID = button.closest("article").dataset.id; 
            let itemColor = button.closest("article").dataset.color;
            let element = contentLS.find(product => product.id == itemID && product.color == itemColor); 
            let productIdx = contentLS.indexOf(element) 
            button.closest("article").remove(); // delete the closest <article> (dom only)
            contentLS.splice(getIndexProduct(button, contentLS), 1); // Select one element from productIdx & delete it himself (localStorage)
            saveBasket("product_list", contentLS)  
        })
    })
}

function getTotalPrice() {
    let arr = Array.prototype.slice.call(document.querySelectorAll(".cart__item__content__description >:nth-child(3)"))
    // Passe le résultat de querySelectorAll de nodelist à un array  
    let arrPrices = []
    for (let itemPrice of arr) {
        let itemQty = contentLS[getIndexProduct(itemPrice, contentLS)].qty;
        arrPrices.push((parseInt(itemPrice.textContent.replace("€","")))*itemQty);
        // Push in arrPrices le text.content de chaque prix en remplaçant € par rien, en mutipliant par la quantité du produit tout en convertissant le tout en type number
    }
    return arrPrices.reduce((acc, x) => acc + x)
}

function getTotalQuantity(locStorage) {
    return locStorage.map(item => parseInt(item.qty)).reduce((acc, i) => acc + i);
}


// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()