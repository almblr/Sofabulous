let monApi = "http://localhost:3000/api/products/";
const str = window.location; // Return l'URL actuelle sous forme de str(ing)
const url = new URL(str); // searchParams fonctionne avec une url
const idProduit = url.searchParams.get("id"); // Récup' la partie ID du lien
monApi += `${idProduit}`; // Return API de base + ID Produit
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const bouton = document.querySelector("#addToCart");

// Créé l'objet de façon dynamique avec les éléments déjà existants sur la page (price/qty/color) et ceux de l'api (id)
function ProductInfo(dataAPI) {
    return productObject = {
        id : dataAPI._id,
        qty : parseInt(document.querySelector("#quantity").value), // parseInt : Convert type str into type nbr
        color : document.querySelector("#colors").value
    };
};


function addToLocalStorage(objLocStorage, tabData, productData) {
    let foundProduct = objLocStorage.find(elementInLS => elementInLS.id === productData.id && elementInLS.color === productData.color); // Compare l'ID et la couleur du produit à ajouter à ceux des produits dans le LS
    if(foundProduct) { // S'ils sont identiques (if(foundProduct != undifined))
        foundProduct.qty += productData.qty; // Update qty 
        alert(`La quantité de votre article a été actualisée !`)
    } 
    if (foundProduct == undefined) { // Sinon, si l'ID et la couleur sont différents 
        objLocStorage.push(ProductInfo(tabData)); // Je push mon nouvel objet dans mon tableau du LS
        alert("L'article a bien été ajouté dans votre panier.")
    }
    localStorage.setItem(`product_list`, JSON.stringify(objLocStorage)); // Update le LS - json.stringify convertir une valeur JS en chaîne JSON
};

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">` // créer l'image puis l'appenchild
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
            if (localStorage.getItem("product_list")) {  // Si le LS contient déjà la clé product_list
                let tabProduct = JSON.parse(localStorage.getItem(`product_list`)); // Récup le contenu du LS en format JSON (il est en string de base)
                addToLocalStorage(tabProduct, data, ProductInfo(data)); //ProductInfo retourne un objet 
            }
            if (localStorage.getItem("product_list") === null) { // Si le LS ne contient pas la clé product_list
                let tabProduct = []; // je créé le tableau qui servira de valeur à cette clé
                addToLocalStorage(tabProduct, data, ProductInfo(data));
            } 
        })
    });     


    // enlever le deuxième if en rajoutant un return dans le premier