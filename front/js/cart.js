let sectionItem = document.querySelector("#cart__items");
const submitButton = document.getElementById("order");
let contentLS = JSON.parse(localStorage.getItem(`product_list`));

function saveBasket(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
};

// Retourne promises (un array de promesses) qui contient tous mes affichages de produits en HTML
function fillCart() {
    if (contentLS === null) { // Si localStorage est vide, ne fait rien
    } else {
        let promises = [];
        for (let product of contentLS) {
            const promise = new Promise(async (resolve) => { // Autant de promesses que de produits
                let monApi = `http://localhost:3000/api/products/${product.id}`;
                const response = await fetch(monApi) 
                const data = await response.json() // Await pour attendre le fetch au-dessus
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

const allPromises = fillCart(); // Pour éviter d'écrire Promise.all(fillCart()).then car pas très visuel
Promise.all(allPromises).then(() => { // Return .then si ttes les promesses sont réussies/terminées
    changeQuantity();
    deleteItem();
    getTotalQuantity();
    getTotalPrice();
});

// Permet de retourner l'index du produit
function getProductIndex(item) {
    let itemID = item.closest("article").dataset.id; // get dataset.id of the closest <article>
    let itemColor = item.closest("article").dataset.color; // idem for color
    let idxProduct = contentLS.findIndex(product => product.id == itemID && product.color == itemColor); // Compare les ID et les couleurs des produits et sélectionne ceux qui correspondent pour avoir produit DOM = produit LS.
    return idxProduct;
}

// Changer la quantité d'un article
function changeQuantity() {
    let allQtyInputs = document.querySelectorAll(".itemQuantity");
    allQtyInputs.forEach(itemInput => { // Pour chaque input parmi allQtyInputs
        itemInput.addEventListener("change", () => {
            let itemQty = parseInt(itemInput.value);
            if (itemInput.value < 1) {
                itemInput.closest("article").remove(); // Suppression au niveau du DOM
                contentLS.splice(getProductIndex(itemInput), 1); // Select one element from productIdx & delete it (donc lui-même)
                saveBasket("product_list", contentLS);
                getTotalQuantity();
                getTotalPrice();
            }
            if (itemInput.value >= 1 && itemInput.value <= 100) {
                contentLS[getProductIndex(itemInput)].qty = itemQty; // La qty du produit dans le LS prend la valeur de l'input
                saveBasket("product_list", contentLS);
                getTotalQuantity();
                getTotalPrice();
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
};

// Supprimer un article du DOM et du LS
function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.closest("article").remove(); 
            contentLS.splice(getProductIndex(button), 1);
            saveBasket("product_list", contentLS)  
            getTotalQuantity();
            getTotalPrice();
        })
    })
};

// Calcule la quantité totale
function getTotalQuantity() { 
    if (contentLS.length == 0) { // S'il n'y a pas de calcul à faire car panier vide
        document.getElementById("totalQuantity").innerText = "0";
        document.getElementById("totalPrice").innerText = "0";
    } else {
        document.getElementById("totalQuantity").innerText = contentLS.map(item => parseInt(item.qty)).reduce((acc, i) => acc + i); // Éviter de faire une boucle avec une déclaration de sum etc...
    }
};

// Calcul du prix total en fonction du prix de chaque item par rapport à sa qty
function getTotalPrice() {
    if (contentLS.length != 0) {
        let arr = document.querySelectorAll(".cart__item__content__description >:nth-child(3)");
        let arrPrices = [] // On initialise un tableau vide pour stocker les prix
        for (let itemPrice of arr) {
            let itemQty = contentLS[getProductIndex(itemPrice)].qty; // On récupère la quantité de l'article
            arrPrices.push(((Number(itemPrice.textContent.replace("€","")))*itemQty));
            // Push in arrPrices le text.content de chaque prix en mutipliant par la quantité du produit tout en convertissant le tout en type number (le replace enlève le signe €)
        }
        document.getElementById("totalPrice").innerText = arrPrices.reduce((acc, x) => acc + x);
    } else {
        getTotalQuantity();  
    }      
};



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
};

// Mise en place du test pour comparer la regex à ce qui a été saisi dans l'input
function testInput(nameInput, regexInput) {
    let input = document.getElementById(nameInput);
    let regex = new RegExp(regexInput);
    let test = regex.test(input.value);
    if (test) {
        return true;
    } else {
        return false;
    }
};

// Applique le test pour chaque input du formulaire et agit en conséquence du résultat
function initValidation() {
    let inputs = document.querySelectorAll("form input[name]"); // Exclut le bouton grâce au [name]
    inputs.forEach(input => {
        input.addEventListener("change", () => {
            for (let key in inputValidations) { // On boucle sur le tableau des regex
                if (input.name === key) { // Si le nom de l'input en HTML correspond à la clé (key) du tableau
                    let test = testInput(key, inputValidations[key].regex) // On fait le test 
                    let errorMsg = input.nextElementSibling;
                    if (test === true) { // Si le test est bon
                        console.log(test);
                        if (errorMsg) { // Supprime le message d'erreur s'il a déjà été affiché
                            errorMsg.innerText = "";
                        } else {
                            console.log(test);
                        }
                    } else { // S'il est mauvais, l'indique à l'utilisateur
                        console.log(test);
                        errorMsg.innerText = `${inputValidations[key].frenchName} incorrect(e)`;
                    }
                }
            }
        })
    })
}; 

initValidation();

// Deuxième test du formulaire qui se fait au niveau du click 
function valideForm () {
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        for (let validationKey of Object.keys(inputValidations)) { // Object.keys rend inputValidations (qui est un objet) iterable car il renvoie un tableau de ses clés
            const validationRule = inputValidations[validationKey];
            console.log(validationRule);
            if (testInput(validationKey, validationRule.regex)) { // Si le test est true
                continue; // passe au test de l'input suivant
            } else { // Si le test est false
                return; // Quitte la boucle, y a plus de test à faire vu que celui que je fais est false
            }
        } 
        const userInfo = { // Objet user à envoyer avec la méthode POST
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        }
        const productsID = contentLS.map(x => x.id); // Tableau d'id : récupère l'ID de chaque produit et le stock
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(
                {contact:userInfo,
                products:productsID,
            }),
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            document.location = `./confirmation.html?id=${data.orderId}`; // Redirige l'user vers ce lien
        })
    })
}
valideForm();