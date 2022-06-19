const str = window.location; // Return l'URL actuelle sous forme de string
const url = new URL(str); // searchParams fonctionne avec une url
const orderID = url.searchParams.get("id"); // Retourne l'id de la commande
document.getElementById("orderId").innerText = orderID;