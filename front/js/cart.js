let monApi = "http://localhost:3000/api/products/";

function getLocalStorage() {

    let monTableau = JSON.parse(localStorage.getItem(`product_list`)); // JSON.Parse transforme un string en objet JSON
    for (const canape of monTableau) {
        let idItem = canape.id;
        let qtyItem = canape.qty;
        let colorItem = canape.color;
        // return [idItem, qtyItem, colorItem];
        console.log(monTableau);
        
    }
}

// sectionItem.innerHTML(`<article class="cart__item" data-id="${idItem}" data-color="{product-color}"></article>`);

getLocalStorage();


