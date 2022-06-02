let sectionItem = document.querySelector("#cart__items");

// Je récupère le contenu de mon localStorage
function getLocalStorage() {
    let content = JSON.parse(localStorage.getItem(`product_list`)); // JSON.Parse transforme un string en objet JSON
    return content;
};
// fillCart sert à remplir la page panier avec les produits ajoutés au panier
function fillCart() {
    let promises = [];
    let tabLStrorage = getLocalStorage();
    for (let product of tabLStrorage) {
        const promise = new Promise(async(resolve) => {
            let monApi = `http://localhost:3000/api/products/${product.id}`; // Car je veux les infos de chaque produit
            const response = await fetch(monApi) // Pour récupérer les autres infos des produits
            const data = await response.json() // Ici mon data est un objet et non un tableau !
            /// Création de la balise article ///
            const article = document.createElement("article");
            article.classList.add("cart__item");
            article.setAttribute("data-id", product.id)
            article.setAttribute("data-color", product.color)
            article.innerHTML = /*HTML */`
            <div class="cart__item__img">
            <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${product.color}</p>
                    <p>${data.price}</p>
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

const promises = fillCart();
Promise.all(promises).then(() => { // nous dit quand ttes les promesses sont terminées et lance le .then si c'est le cas
    console.log(document.getElementsByClassName("itemQuantity"));
    let input = Array.from(document.querySelectorAll(".itemQuantity"));
    console.log(input);
})




// getElementByClassName est une interface de collection d'élements qui ressemble à un tableau mais n'est pas pas vraiment un. Du coup faut d'abord transformer le contenu en tableau avec [...elements].forEach ou Array.from(elements).forEach()


// mélanger createElement (sur l'élément parent) avec innerHTML (pour remplir le parent) 