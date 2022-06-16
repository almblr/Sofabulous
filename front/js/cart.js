let sectionItem = document.querySelector("#cart__items");
const submitButton = document.getElementById("order");
let contentLS = JSON.parse(localStorage.getItem(`product_list`));
let arrayUsers = JSON.parse(localStorage.getItem(`users_list`));

// get le contenu du localStorage sous forme d'objet avec le json.parse

/**
 * 
 * @returns Un tableau de promesses (autant de promesses que de produit avec la boucle for of)qui contient tous mes affichages de produit en HTML
 */
function fillCart() {
    if (contentLS === null) {
        console.log("Y A R");
    } else {
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
function saveBasket(value, tab) {
    localStorage.setItem(value, JSON.stringify(tab))
};

// Permet de retourner l'index du produit
function getProductIndex(item) {
    let itemID = item.closest("article").dataset.id; // get dataset.id of the closest <article>
    let itemColor = item.closest("article").dataset.color; // idem for color
    let productIdx = contentLS.findIndex(product => product.id == itemID && product.color == itemColor); // Compare les ID et les couleurs des produits et sélectionne ceux qui correspondent pour avoir produit DOM = produit LS.
    return productIdx;
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

// Changer la quantité d'un article
function changeQuantity() {
    let allQtyInputs = document.querySelectorAll(".itemQuantity");
    allQtyInputs.forEach(itemInput => { // pour chaque input parmi allQtyInputs
        itemInput.addEventListener("change", () => {
            let itemQty = parseInt(itemInput.value);
            if (itemInput.value < 1) {
                itemInput.closest("article").remove();
                contentLS.splice(getProductIndex(itemInput), 1);
                saveBasket("product_list", contentLS);
                getTotalQuantity();
                getTotalPrice();
            }
            if (itemInput.value >= 1 && itemInput.value <= 100) {
                contentLS[getProductIndex(itemInput)].qty = itemQty; // La qty du LS prend la valeur de l'input
                saveBasket("product_list", contentLS);
                getTotalPrice();
                getTotalQuantity();
            }
            if (itemInput.value > 100) {
                alert("La valeur maximale est de 100 canapés.");
                itemInput.value = 100;
                itemQty = 100;
                contentLS[getProductIndex(itemInput)].qty = itemQty;
                saveBasket("product_list", contentLS);
                getTotalQuantity();
                getTotalPrice();
            }
        })
    })
}

// Calcul du prix total en fonction du prix de chaque item par rapport à sa qty
function getTotalPrice() {
    if (contentLS.length != 0) {
        let arr = document.querySelectorAll(".cart__item__content__description >:nth-child(3)");
        let arrPrices = [] // On initialise un tableau vide pour stocker les prix
        for (let itemPrice of arr) {
            let itemQty = contentLS[getProductIndex(itemPrice)].qty; // On récupère la quantité de l'article
            arrPrices.push(((Number(itemPrice.textContent.replace("€","")))*itemQty));
            // Push in arrPrices le text.content de chaque prix en mutipliant par la quantité du produit tout en convertissant le tout en type number donc ça exclut le €
        }
        document.getElementById("totalPrice").innerText = arrPrices.reduce((acc, x) => acc + x) // Calcul du prix total
    } else {
        getTotalQuantity()  
    }      
}

// Calcule la quantité totale. 
function getTotalQuantity() { 
    if (contentLS.length == 0) { // S'il n'y a pas de calcul à faire car panier vide
        document.getElementById("totalQuantity").innerText = "0";
        document.getElementById("totalPrice").innerText = "0";
    } else {
        document.getElementById("totalQuantity").innerText = contentLS.map(item => parseInt(item.qty)).reduce((acc, i) => acc + i);
    }
}

const inputValidations = {
    firstName : {
        regex:"^[A-Za-zÀ-ü-' ]+$",
        frenchName:"Prénom"
    },
    lastName : {
        regex:"^[A-Za-zÀ-ü-' ]+$",
        frenchName:"Nom"
    },
    address : {
        regex:"^[0-9]+\\s[A-Za-zÀ-ü-'\\s]+",
        frenchName:"Adresse"
    },
    city : {
        regex:"^[A-Za-zÀ-ü-' ]+$",
        frenchName:"Ville"
    },
    email : {
        regex:".+\@.+\..+",
        frenchName:"Email"
    }
}

function testInput(nameInput, regexInput) {
    let input = document.getElementById(nameInput);
    let regex = new RegExp(regexInput);
    let test = regex.test(input.value);
    if (test) {
        return true;
    } else {
        return false;
    }
}

function initValidation() {
    let inputs = document.querySelectorAll("form input[name]");
    inputs.forEach(input => {
        input.addEventListener("change", () => {
            for (let key in inputValidations) {
                if (input.name === key) {
                    let test = testInput(key, inputValidations[key].regex)
                    let errorMsg = input.nextElementSibling;
                    if (test === true) {
                        console.log(test);
                        if (errorMsg) {
                            errorMsg.remove();
                        } else {
                            console.log(test);
                        }
                    } else {
                        console.log(test);
                        errorMsg.innerText = `${inputValidations[key].frenchName} incorrect(e)`;
                    }
                }
            }
        })
    })
} 
initValidation();

// Pour checker si tous les champs respectent la regex. Si un champ n'est pas valide, il quitte la boucle. S'ils sont tous valides, log le "coucou"
function valideForm () {
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        for (let validationKey of Object.keys(inputValidations)) { // Object.keys rend inputValidations (qui est un objet) iterable car il renvoie un tableau de ses clés
            const validationRule = inputValidations[validationKey];
            if (testInput(validationKey, validationRule.regex)) { // Si le test est true
                continue; // passe au test de l'input suivant
            } else { // Si le test est false
                return; // Quitte la boucle, y a plus de test à faire vu que celui que je fais est false
            }
        } 
        const user = {
            firstname: document.getElementById("firstName").value,
            lastname:document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        }
        const produitsUser = contentLS;
        if (localStorage.getItem("users_list")) {
            let arrayUsers = JSON.parse(localStorage.getItem(`users_list`));
            arrayUsers.push(user)
            saveBasket("users_list", arrayUsers)
        } else {
            const arrayUsers = [];
            arrayUsers.push(user)
            saveBasket("users_list", arrayUsers)
        }
    })
}
valideForm();


// console.log(inputValidations); // Renvoie un object
// console.log(Object.keys(inputValidations)); // Renvoie un Array qui contient les clés de mon objet inputValidations