////////////////////////// FICHE PRODUIT //////////////////////////
////////////////////////// FICHE PRODUIT //////////////////////////
////////////////////////// FICHE PRODUIT //////////////////////////



let monApi = "http://localhost:3000/api/products/";
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const str = window.location; // Return l'URL actuelle sous forme de str(ing)
const url = new URL(str); // vv searchParams vv fonctionne avec un url
const idProduit = url.searchParams.get("id"); // Récup' la partie ID du lien


monApi += `${idProduit}`; // return API de base + ID Produit

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
    })
    .catch(erreur => console.log("Error 4 sans Kanap"));

////////////////////////// ADD TO CART //////////////////////////
////////////////////////// ADD TO CART //////////////////////////
////////////////////////// ADD TO CART //////////////////////////

const bouton = document.querySelector("#addToCart");

let product = {
    id : 0,
    qty : 0,
    color: ""
};

// productInfo créé & remplace les variables des infos produits (prix, couleur...) de façon dynamique
function ProductInfo(productObject, productData) {
    let id = productData._id;
    let qty = parseInt(document.querySelector("#quantity").value); // parseInt : Tranform type str en type number
    let colour = document.querySelector("#colors").value;
    productObject.id = id;
    productObject.qty=qty;
    productObject.color=colour;
    return productObject;
};

bouton.addEventListener("click", function() {
    if (localStorage.getItem("product_list") === null) { // si le localstorage ne contient pas la clé product_list
        let tabProduct = []; // je créé le tableau qui servira de valeur à cette clé
        fetch(monApi)
            .then((response) => response.json())
            .then((data) => {
                tabProduct.push(ProductInfo(product, data)); // push l'objet dans le tableau 
                localStorage.setItem(`product_list`, JSON.stringify(tabProduct)); // met les données du produit dans le localstorage
                alert("L'article a bien été ajouté dans votre panier.")
            }) //json.stringify pour stocker des objets sous forme json
            .catch(erreur => console.log("Error 4 sans Kanap"));
    } else {  // Sinon, ajoute des objets (produit) dans le tableau existants
        fetch(monApi)
            .then((response) => response.json())
            .then((data) => {
                let tabProduct = JSON.parse(localStorage.getItem(`product_list`)); // Récup le contenu du localstorage sous format JSON (il est en string de base)
                tabProduct.push(ProductInfo(product, data));
                localStorage.setItem(`product_list`, JSON.stringify(tabProduct));
                alert("L'article a bien été ajouté dans votre panier.")
            })
        .catch(erreur => console.log("Error 4 sans Kanap"));
    }
});

/// Ne pas avoir de doublon, additioner les quantités pour chaque item


//// essayer de faire fonctionner le code avec unseul fetch plutôt que trois (enregistrer les données et les re use)
/// fusion des produis : array.find

/// rebooser l'index et product avant de partir sur cart