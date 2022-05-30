let monApi = "http://localhost:3000/api/products/";
const str = window.location; // Return l'URL actuelle sous forme de str(ing)
const url = new URL(str); // vv searchParams vv fonctionne avec un url
const idProduit = url.searchParams.get("id"); // Récup' la partie ID du lien
monApi += `${idProduit}`; // return API de base + ID Produit

const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const bouton = document.querySelector("#addToCart");

let product = { // Produit "vide"
    id : 0,
    qty : 0,
    color: ""
};

// Créé & remplace les variables des infos produits de façon dynamique avec les éléments déjà existants sur la page (price qty color) et ceux de l'api (id product)
function ProductInfo(productObject, productData) {
    let id = productData._id;
    let qty = parseInt(document.querySelector("#quantity").value); // parseInt : Convert type str into type nbr
    let colour = document.querySelector("#colors").value;
    productObject.id = id;
    productObject.qty=qty;
    productObject.color=colour;
    return productObject;
};

/**
 * Ajoute les items dans le localstorage
 * @param {array} tabLocStorage - Tableau d'objets local storage
 * @param {*} tabData 
 * @param {*} productData 
 */
function addToLocalStorage(tabLocStorage, tabData, productData) {
    tabLocStorage.push(ProductInfo(productData, tabData)); // push l'objet dans le tableau 
    localStorage.setItem(`product_list`, JSON.stringify(tabLocStorage)); // met les données du produit dans le localstorage
    alert("L'article a bien été ajouté dans votre panier.")
    //json.stringify pour stocker des objets sous forme json
};

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
        title.innerText = data.name;
        price.innerText = data.price;
        description.innerHTML = data.description; // à mettre en innerText
        for (let color of data.colors) {
            const newOption = document.createElement("option");
            newOption.setAttribute("value", `${color}`);
            newOption.innerText = color;
            couleurs.appendChild(newOption);
        };
        bouton.addEventListener("click", function() {
            if (localStorage.getItem("product_list")) {  
                let tabProduct = JSON.parse(localStorage.getItem(`product_list`)); // Récup le contenu du localstorage sous format JSON (il est en string de base)
                addToLocalStorage(tabProduct, data, product);
            }
            if (localStorage.getItem("product_list") === null) { // si le localstorage ne contient pas la clé product_list
                let tabProduct = []; // je créé le tableau qui servira de valeur à cette clé
                addToLocalStorage(tabProduct, data, product);
            } 

        })
    });     