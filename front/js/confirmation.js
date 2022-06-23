function displayOrderID() {
    const str = window.location; // On récupère la string de l'URL
    const url = new URL(str);  // On la stocke dans un objet URL
    const orderID = url.searchParams.get("id"); // On récupère l'ID (qui est l'orderID)
    document.getElementById("orderId").innerText = orderID; // On complète le contenu HTML
}

displayOrderID();

