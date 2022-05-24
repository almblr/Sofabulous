/// FICHE PRODUIT ///
/// FICHE PRODUIT ///
/// FICHE PRODUIT ///

let monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const str = window.location; // renvoie le lien de l'URL actuelle sous forme de string
const url = new URL(str); // créé un URL qui a la valeur de la string au-dessus pour use searchParams
const idProduit = url.searchParams.get("id"); // Je récup la partie ID du lien


monApi += `${idProduit}`; // du coup le nouveau lien de mon api sera le lien précédent suivi de l'ID produit

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
        title.innerText = data.name;
        price.innerText = data.price;
        description.innerHTML = data.description;
        for (let color of data.colors) {
            couleurs.innerHTML += `<option value ="${color}">${color}</option>`
        };
    })
    .catch(erreur => console.log("Error 4 sans Kanap"));

/// AJOUTER AU PANIER ///
/// AJOUTER AU PANIER ///
/// AJOUTER AU PANIER ///

const bouton = document.querySelector("#addToCart");
let product = {
    id : 0,
    qty : 0,
    price : 0,
    color: ""
}

function ProductInfo(productObject, productData) {
    let id = productData._id;
    let qty = parseInt(document.querySelector("#quantity").value); // parseInt : transforme un type strin en type number
    let price = productData.price*document.querySelector("#quantity").value; //  * qty of input
    let colour = document.querySelector("#colors").value;
    productObject.id = id;
    productObject.qty=qty;
    productObject.price=price;
    productObject.color=colour;
    return productObject;
}

bouton.addEventListener("click", function() {
    if (localStorage.getItem("product_list") === null) { // si mon localstorage ne contient pas la clé product_list
        let tabProduct = []; // je créé le tableau qui servira de valeur à cette clé
        fetch(monApi)
            .then((response) => response.json())
            .then((data) => {
                tabProduct.push(ProductInfo(product, data));
                localStorage.setItem(`product_list`, JSON.stringify(tabProduct));
            }); //json.stringify pour stocker des objets sous forme json
    } else {
        fetch(monApi)
        .then((response) => response.json())
        .then((data) => {
            let tabProduct = JSON.parse(localStorage.getItem(`product_list`)); // je récup le contenu du localstorage (qui est en string de base mais qui devient un tableau avec JSON.parse)

            tabProduct.push(ProductInfo(product, data));
            localStorage.setItem(`product_list`, JSON.stringify(tabProduct));
        }); 
    }
});







