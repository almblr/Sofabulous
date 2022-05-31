let monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const section = document.querySelector("#items"); // On sélectionne la section en en HTML

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        for (let item of data) {
            const newLink = document.createElement("a");
            newLink.setAttribute("href", `product.html?id=${item._id}`);
            const newArticle = document.createElement("article");
            const newImg = document.createElement("img");
            newImg.setAttribute("src", `${item.imageUrl}`);
            newImg.setAttribute("alt", `${item.altTxt}`);
            const newTitle = document.createElement("h3");
            const newParagraph = document.createElement("p");
            newParagraph.innerText = item.description;
            section.appendChild(newLink);
            newLink.appendChild(newArticle);
            newArticle.appendChild(newImg);
            newArticle.appendChild(newTitle);
            newArticle.appendChild(newParagraph);
        };
    }
);
