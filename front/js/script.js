let apiLink = "http://localhost:3000/api/products/";
const section = document.querySelector("#items");

fetch(apiLink)
  .then((response) => response.json())
  .then((data) => {
    for (let item of data) {
      const newLink = document.createElement("a");
      newLink.setAttribute("href", `product.html?id=${item._id}`);
      newLink.innerHTML = /*HTML*/ `
                <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}">
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article>`;
      section.appendChild(newLink);
    }
  });
