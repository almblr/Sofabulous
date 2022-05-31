let monApi = "http://localhost:3000/api/products/";
const str = window.location; // Return l'URL actuelle sous forme de str(ing)
const url = new URL(str); // searchParams fonctionne avec une url
const idProduit = url.searchParams.get("id"); // Récup' la partie ID du lien
monApi += `${idProduit}`; // Return API de base + ID Produit
/// DOM ///
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const couleurs = document.querySelector("#colors");
const bouton = document.querySelector("#addToCart");

// Créé & remplace les variables des infos produits de façon dynamique avec les éléments déjà existants sur la page (price qty color) et ceux de l'api (id product)
function ProductInfo(dataAPI) {
    return productObject = {
        id : dataAPI._id,
        qty : parseInt(document.querySelector("#quantity").value), // parseInt : Convert type str into type nbr
        color : document.querySelector("#colors").value
    };
};


function addToLocalStorage(objLocStorage, tabData, productData) {
    let foundProduct = objLocStorage.find(elementInLS => elementInLS.id === productData.id && elementInLS.color === productData.color);
    console.log(productData);
    if(foundProduct) { 
        foundProduct.qty += productData.qty; // J'update la quantité de l'article déjà présent avec la quantité de l'article que j'ajoute
        alert(`La quantité de votre article a été actualisée !`)
    } 
    if (foundProduct == undefined) { // Si l'ID et la couleur sont différents 
        objLocStorage.push(ProductInfo(tabData)); // Je push mon nouvel objet dans mon tableau du localstorage
        alert("L'article a bien été ajouté dans votre panier.")
    }
    localStorage.setItem(`product_list`, JSON.stringify(objLocStorage)); // met les données du produit dans le localstorage - json.stringify pour stocker des objets sous forme json
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
                addToLocalStorage(tabProduct, data, ProductInfo(data));
            }
            if (localStorage.getItem("product_list") === null) { // si le localstorage ne contient pas la clé product_list
                let tabProduct = []; // je créé le tableau qui servira de valeur à cette clé
                addToLocalStorage(tabProduct, data, ProductInfo(data));
            } 

        })
    });     
