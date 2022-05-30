const monApi = "http://localhost:3000/api/products/"; // On déclare une variable pour stocker l'API
const section = document.querySelector("#items");

function addElement(i) {
    const newLink = document.createElement("a");
    newLink.setAttribute("href", `product.html?id=${i._id}`);
    const newArticle = document.createElement("article");
    const newImg = document.createElement("img");
    newImg.setAttribute("src", `${i.imageUrl}`);
    newImg.setAttribute("alt", `${i.altTxt}`);
    const newTitle = document.createElement("h3");
    const newParagraph = document.createElement("p");
    newParagraph.innerText = `${i.description}`;
    section.appendChild(newLink);
    newLink.appendChild(newArticle);
    newArticle.appendChild(newImg);
    newArticle.appendChild(newTitle);
    newArticle.appendChild(newParagraph);
};

fetch(monApi)
    .then((response) => response.json())
    .then((data) => {
        for (let item of data) {
            addElement(item);
    }});
