// DOM & Déclarations globales 

let monApi = "http://localhost:3000/api/products/";
const str = window.location; // Return l'emplacement actuel du document (ici son URL)
const url = new URL(str); // Créer une URL avec cette string
const idProduit = url.searchParams.get("id"); // Récup' la partie ID de l'URL
monApi += `${idProduit}`; // Return API de base + ID Produit
const divImage = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const bouton = document.querySelector("#addToCart");

/**
 * Sert à mettre à jour le LS
 * @param {*} key Clé LS
 * @param {*} value Données à stocker / mettre à jour dans le LS (un tableau dans notre cas)
 */
 function saveBasket(key, value) {
    localStorage.setItem(key, JSON.stringify(value)) // json.stringify convertit une valeur JS en chaîne JSON
};


/**
 * Créér et retourne l'objet qui sera push dans tabProduct avec les infos produits déjà existantes sur la page (price/qty/color) et celle de l'api (id)
 * @param {*} apiData 
 * @returns L'objet est retourné
 */
function ProductInfo(apiData) {
    return productObject = {
        id : apiData._id,
        qty : parseInt(document.querySelector("#quantity").value), // parseInt : Convert type str into type nbr (entier)
        color : document.querySelector("#colors").value
    };
};

/**
 * Ajoute l'article dans le panier selon et s'il est déjà présent, actualise sa quantité
 * @param {*} locStoData Données du localstorage (ici c'est un tableau)
 * @param {*} apiData Données de l'API
 * @param {*} productData Données du produits à push
 */
function addToLocalStorage(locStoData, apiData, productData) {
    let foundProduct = locStoData.find(elementInLS => elementInLS.id === productData.id && elementInLS.color === productData.color); // Compare l'ID et la couleur du produit à ajouter à ceux des produits dans le LS
    if(foundProduct) { // S'ils sont identiques (if (foundProduct != undifined))
        foundProduct.qty += productData.qty; // Update qty 
        alert(`La quantité de votre article a été actualisée !`)
    } 
    if (foundProduct == undefined) { // Sinon, si l'ID et la couleur sont différents 
        locStoData.push(ProductInfo(apiData)); // Je push mon nouvel objet dans mon tableau du LS
        alert("L'article a bien été ajouté dans votre panier.")
    }
    saveBasket("product_list", locStoData)  
};

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        const imageProduct = document.createElement("img")
        imageProduct.setAttribute("src", data.imageUrl)
        imageProduct.setAttribute("alt", data.altTxt)
        divImage.appendChild(imageProduct);
        title.innerText = data.name;
        price.innerText = data.price;
        description.innerText = data.description;
        for (let color of data.colors) {
            const newOption = document.createElement("option");
            newOption.setAttribute("value", `${color}`);
            newOption.innerText = color;
            couleurs.appendChild(newOption);
        };
        bouton.addEventListener("click", function() {
            if (localStorage.getItem("product_list")) {  // Si la clé "product_list" du LS n'est pas vide
                let contentLS = JSON.parse(localStorage.getItem(`product_list`)); // Récup' et convert le contenu du LS en objet JS (il est en string de base)
                addToLocalStorage(contentLS, data, ProductInfo(data)); // On push l'objet grâce à ProductInfo
            }
            else { // Sinon, si elle est vide
                let contentLS = []; // Créer le tableau qui servira de valeur à cette clé
                addToLocalStorage(contentLS, data, ProductInfo(data));
            } 
        })
    });