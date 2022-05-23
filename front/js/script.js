const monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const section = document.querySelector("#items"); // On déclare une variable pour appeler la section #items en HTML


fetch(monApi).then((response) => 
    response.json().then((data) => {
        console.log(data);
        for (let item of data) {
            section.innerHTML += `<a href="product.html?id=${item._id}"><article><img src="${item.imageUrl}" alt="${item.altTxt}"> <h3>${item.name}</h3><p>${item.description}</p></article>`;
        } // Pour chaque produit, ajoute l'HTML ci-dessus dans la section

    }));