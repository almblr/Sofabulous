function displayOrderID() {
    const str = window.location; 
    const url = new URL(str);  
    const orderID = url.searchParams.get("id"); 
    document.getElementById("orderId").innerText = orderID;
}

displayOrderID();

