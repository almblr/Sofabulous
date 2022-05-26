const monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const section = document.querySelector("#items");


fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        for (let item of data) {
            section.innerHTML += `<a href="product.html?id=${item._id}"><article><img src="${item.imageUrl}" alt="${item.altTxt}"> <h3>${item.name}</h3><p>${item.description}</p></article>`;
        } // Ajoute l'HTML ci-dessus dans la section pour tous les produits dans le tableau data (les 8 canapés)

    });


    /// refaire le for avec create element mais pas supp le innerHTML mais le commenter. create element + lourde mais meilleure en perfs (ma solution recréé à chaque fois les élements)