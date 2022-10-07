let sectionItem = document.querySelector("#cart__items");
const submitButton = document.getElementById("order");
let contentLS = JSON.parse(localStorage.getItem(`product_list`));

function saveBasket(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function fillCart() {
  if (contentLS === null) {
  } else {
    let promises = [];
    for (let product of contentLS) {
      const promise = new Promise(async (resolve) => {
        // Autant de promesses que de produits
        let monApi = `http://localhost:3000/api/products/${product.id}`;
        const response = await fetch(monApi);
        const data = await response.json();
        /// Création de la balise article ///
        const article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", product.id);
        article.setAttribute("data-color", product.color);
        article.innerHTML = /*HTML */ `
                    <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${data.name}</h2>
                            <p>${product.color}</p>
                            <p>${data.price}€</p>
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
                    </div>`;
        sectionItem.appendChild(article);
        resolve();
      });
      promises.push(promise);
    }
    return promises;
  }
}

const allPromises = fillCart(); // Better than Promise.all(fillCart()).then
Promise.all(allPromises).then(() => {
  getTotalQuantity();
  getTotalPrice();
  changeQuantity();
  deleteButton();
  initValidation();
  valideForm();
});

// Permet de retourner l'index du produit
function getProductIndex(item) {
  let itemID = item.closest("article").dataset.id;
  let itemColor = item.closest("article").dataset.color;
  let idxProduct = contentLS.findIndex(
    (product) => product.id == itemID && product.color == itemColor
  );
  return idxProduct;
}

// Calcule la quantité totale
function getTotalQuantity() {
  if (contentLS.length == 0) {
    document.getElementById("totalQuantity").innerText = "0";
    document.getElementById("totalPrice").innerText = "0";
  } else {
    document.getElementById("totalQuantity").innerText = contentLS
      .map((item) => parseInt(item.qty))
      .reduce((acc, i) => acc + i);
  }
}

// Calcul du prix total en fonction du prix de chaque item par rapport à sa qty
function getTotalPrice() {
  if (contentLS.length != 0) {
    let arr = document.querySelectorAll(
      ".cart__item__content__description >:nth-child(3)"
    );
    let arrPrices = [];
    for (let itemPrice of arr) {
      let itemQty = contentLS[getProductIndex(itemPrice)].qty;
      arrPrices.push(Number(itemPrice.textContent.replace("€", "")) * itemQty);
    }
    document.getElementById("totalPrice").innerText = arrPrices.reduce(
      (acc, x) => acc + x
    );
  }
  getTotalQuantity(); // Permet l'affichage de qty totale même si le panier est vide
}

function getTotalPriceAndQuantity() {
  getTotalQuantity();
  getTotalPrice();
}

// Suppression d'un item
function deleteItem(element) {
  element.closest("article").remove();
  contentLS.splice(getProductIndex(element), 1);
  saveBasket("product_list", contentLS);
  getTotalPriceAndQuantity();
}

// Suppression d'un item quand l'user clique sur "Supprimer"
function deleteButton() {
  let deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      deleteItem(button);
    });
  });
}

// Changer la quantité d'un article
function changeQuantity() {
  let allQtyInputs = document.querySelectorAll(".itemQuantity");
  allQtyInputs.forEach((itemInput) => {
    itemInput.addEventListener("change", () => {
      let itemQty = parseInt(itemInput.value);
      if (itemInput.value > 100) {
        alert("La valeur maximale est de 100 canapés.");
        itemInput.value = 100;
        itemQty = 100;
        contentLS[getProductIndex(itemInput)].qty = itemQty;
        getTotalPriceAndQuantity();
      } else if (itemInput.value < 1) {
        deleteItem(itemInput);
      } else {
        contentLS[getProductIndex(itemInput)].qty = itemQty;
        getTotalPriceAndQuantity();
      }
      saveBasket("product_list", contentLS);
    });
  });
}

const inputValidations = {
  firstName: {
    regex: /^[A-Za-zÀ-ü-' ]+$/,
    frenchName: "Prénom",
  },
  lastName: {
    regex: /^[A-Za-zÀ-ü-' ]+$/,
    frenchName: "Nom",
  },
  address: {
    regex: /^[0-9]+\s[A-Za-zÀ-ü-'\s]+/,
    frenchName: "Adresse",
  },
  city: {
    regex: /^[A-Za-zÀ-ü-' ]+$/,
    frenchName: "Ville",
  },
  email: {
    regex: /.+\@.+\..+/,
    frenchName: "Email",
  },
};

function testInput(nameInput, regexObj) {
  let input = document.getElementById(nameInput);
  let regex = regexObj;
  let test = regex.test(input.value);
  if (test) {
    return true;
  } else {
    return false;
  }
}

// Applique le test pour chaque input du formulaire et agit en conséquence du résultat
function initValidation() {
  let inputs = document.querySelectorAll("form input[name]"); // Exclut le bouton "Commander!"
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      for (let key in inputValidations) {
        if (input.name === key) {
          let test = testInput(key, inputValidations[key].regex);
          let errorMsg = input.nextElementSibling;
          if (test === true) {
            console.log(test);
            if (errorMsg) {
              errorMsg.innerText = "";
            } else {
              console.log(test);
            }
          } else {
            console.log(test);
            errorMsg.innerText = `${inputValidations[key].frenchName} incorrect(e)`;
          }
        }
      }
    });
  });
}

// Deuxième test du formulaire qui se fait au niveau du clic
function valideForm() {
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    for (let validationKey of Object.keys(inputValidations)) {
      // Object.keys rend inputValidations (qui est un objet) iterable car il renvoie un tableau de ses clés
      const validationRule = inputValidations[validationKey];
      console.log(validationRule);
      if (testInput(validationKey, validationRule.regex)) {
        continue; // Passe à l'itération suivante
      } else {
        return;
      }
    }
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        products: contentLS.map((x) => x.id),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        contentLS.length = 0;
        saveBasket("product_list", contentLS);
        document.location = `./confirmation.html?id=${data.orderId}`;
      });
  });
}
