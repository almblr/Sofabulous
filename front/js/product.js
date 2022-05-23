/// FICHE PRODUIT ///
/// FICHE PRODUIT ///
/// FICHE PRODUIT ///

let monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");


///////////////////////
const str = window.location; // renvoie le lien de l'URL actuelle sous forme de string
const url = new URL(str); // créé un URL qui a la valeur de la string au-dessus
const idProduit = url.searchParams.get("id"); 
// url.searchParams a besoin d'une url d'où ma ligne précédente
// Je récupère le produit pour l'ajouter au lien de mon API car le lien de l'api suivi de l'id produit renvoie pas le tableau entier de tous les canapés mais juste le canapé en question
//////////////////////

monApi += `${idProduit}`; // du coup le nouveau lien de mon api sera le lien précédent suivi de l'ID produit

fetch(monApi).then((response) => 
    response.json()
    .then((data) => {
        image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
        title.innerText = data.name;
        price.innerText = data.price;
        description.innerHTML = data.description;
        for (let color of data.colors) {
            couleurs.innerHTML += `<option value ="${color}">${color}</option>`
        };
    })
    .catch(erreur => console.log("Error 4 sans Kanap"))
);

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

fetch(monApi).then((response) =>
response.json()
.then((data) => {
    let tabProduct = [];
    bouton.addEventListener("click", function() {
        let id = data._id;
        let qty = document.querySelector("#quantity").value;
        let price = `${data.price*document.querySelector("#quantity").value}€`; //  * qty of input
        let colour = document.querySelector("#colors").value;

        product.id = id;
        product.qty=qty;
        product.price=price;
        product.color=colour;
        
        tabProduct.push(product);

        localStorage.setItem(`product_list`, JSON.stringify(tabProduct));
    })})); //json.stringify pour stocker des objets sous forme json
