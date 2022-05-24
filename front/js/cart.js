let monTableau = JSON.parse(localStorage.getItem(`product_list`)); // JSON.Parse transforme un string en objet JSON
const sectionItem = document.querySelector("#cart__items");
let monApi = "http://localhost:3000/api/products/";

for (let idItem of monTableau) {
    idItem = idItem.id;
    console.log(idItem);
}
