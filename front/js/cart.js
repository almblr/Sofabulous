let sectionItem = document.querySelector("#cart__items");
let contentLS = JSON.parse(localStorage.getItem(`product_list`));
// get le contenu du localStorage sous forme d'objet avec le json.parse

/**
 * 
 * @returns Un tableau de promesses (autant de promesses que de produit avec la boucle for of)qui contient tous mes affichages de produit en HTML
 */
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
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}" onKeyDown="return false">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>` // onKeyDown return false permet de ne pas changer la qty au clavier
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
    changeQuantity();
    deleteItem();
    getTotalPrice();
    getTotalQuantity();
});

// Permet de mettre à jour le contenu du LS (le panier)
function saveBasket(key, tab) {
    localStorage.setItem(key, JSON.stringify(tab))
};

// Permet de retourner l'index du produit
function getProductIndex(item) {
    let itemID = item.closest("article").dataset.id; // get dataset.id of the closest <article>
    let itemColor = item.closest("article").dataset.color; // idem for color
    let productIdx = contentLS.findIndex(product => product.id == itemID && product.color == itemColor); // Compare les ID et les couleurs des produits et sélectionne ceux qui correspondent pour avoir produit DOM = produit LS.
    return productIdx;
}

// Changer la quantité d'un article
function changeQuantity() {
    let allQtyInputs = document.querySelectorAll(".itemQuantity");
    allQtyInputs.forEach(itemInput => { // pour chaque input parmi allQtyInputs
        itemInput.addEventListener("change", () => {
            let itemQty = itemInput.value;
            contentLS[getProductIndex(itemInput)].qty = itemQty; // La qty du LS prend la valeur de l'input
            saveBasket("product_list", contentLS);
            getTotalPrice();
            getTotalQuantity();
        })
    })
}

// Supprimer un article du DOM et du LS
function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.closest("article").remove(); // DOM - delete the closest <article> 
            contentLS.splice(getProductIndex(button), 1); // LS - Select one element from productIdx & delete it (donc lui-même) 
            saveBasket("product_list", contentLS)  
            getTotalQuantity();
        })
    })
}

// Calcul du prix total en fonction du prix de chaque item par rapport à sa qty
function getTotalPrice() {
    if (contentLS.length != 0) {
        let arr = document.querySelectorAll(".cart__item__content__description >:nth-child(3)");
        // Passe le résultat de querySelectorAll de nodelist à un array  
        let arrPrices = [] // On initialiser un tableau vide pour stocker les prix
        for (let itemPrice of arr) {
            let itemQty = contentLS[getProductIndex(itemPrice)].qty; // On récupère la quantité de l'article
            arrPrices.push((parseInt(itemPrice.textContent)*itemQty));
            // Push in arrPrices le text.content de chaque prix en mutipliant par la quantité du produit tout en convertissant le tout en type number donc ça exclut le €
        }
        document.getElementById("totalPrice").innerText = arrPrices.reduce((acc, x) => acc + x) // Calcul du prix total
    } else {
        getTotalQuantity()  
    }      
}

function getTotalQuantity() {
    if (contentLS.length == 0) {
        document.getElementById("totalQuantity").innerText = "0";
        document.getElementById("totalPrice").innerText = "0";
    } else {
        document.getElementById("totalQuantity").innerText = contentLS.map(item => parseInt(item.qty)).reduce((acc, i) => acc + i);
    }
}



// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()

//parseInt exclut tout ce qui n'est pas un chiffre genre c'est le Zemmour des lettres XD du coup pas besoin de replace("€", "") pour virer le signe € dans le prix