// Cart Array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function addToCart(name, price, image) {
    // Convert price to a number in case it's passed as a string
    price = parseFloat(price); 
    
    let item = cart.find(i => i.name === name);

    if (item) {
        // FIX 1: If the item exists, update its price to the new current price 
        // before increasing the quantity. This prevents old prices from persisting.
        item.price = price;
        item.qty++;
    } else {
        cart.push({
            name,
            price,
            image,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
}

// REMOVE ITEM
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // Reload the cart display
}

// CHANGE QUANTITY
function changeQty(index, change) {
    let item = cart[index];
    item.qty += change;

    if (item.qty <= 0) {
        // Remove item if quantity drops to 0 or less
        removeItem(index);
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart(); // Reload the cart display
    }
}


// LOAD CART
function loadCart() {
    let cartTable = document.getElementById("cart-body"); // Assuming this is the <tbody>
    let total = 0;

    // Clear the existing content
    if (cartTable) {
        cartTable.innerHTML = ""; 
    } else {
        // Handle case where cart-body element might not be available (e.g., on index.html)
        // If this function is only run on cart.html, this is fine.
        console.warn("Element with ID 'cart-body' not found.");
        return;
    }


    cart.forEach((item, index) => {
        // Ensure item.price is treated as a number
        const itemPrice = parseFloat(item.price); 
        total += itemPrice * item.qty;

        cartTable.innerHTML += `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" width="60"></td> 
                <td>${item.name}</td>
                <td>Rs. ${itemPrice.toFixed(2)}</td>
                <td class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    // Update the total
    let totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "Rs." + total.toFixed(2);
    }
}
// CALCULATOR FUNCTIONS
function calculateEnergy() {
    let rows = document.querySelectorAll(".calc-row");
    let total = 0;

    rows.forEach(row => {
        let watts = parseFloat(row.querySelector(".watts").value) || 0;
        let hours = parseFloat(row.querySelector(".hours").value) || 0;
        let qty = parseFloat(row.querySelector(".qty").value) || 0;

        total += (watts * hours * qty) / 1000; // convert to kWh
    });

    document.getElementById("result").innerText = total.toFixed(2) + " kWh per day";
}

function addRow() {
    let template = document.querySelector(".calc-row");
    let clone = template.cloneNode(true);
    document.getElementById("rows").appendChild(clone);
}

function removeRow() {
    let rows = document.querySelectorAll(".calc-row");
    if (rows.length > 1) rows[rows.length - 1].remove();
}
// Star rating handling
document.querySelectorAll('.stars').forEach(starContainer => {
    starContainer.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            const value = Number(star.getAttribute('data-value'));
            starContainer.querySelectorAll('.star').forEach(s => {
                s.innerHTML = s.getAttribute('data-value') <= value ? '⭐' : '☆';
            });
            starContainer.setAttribute('data-selected', value);
        });
    });
});

// Review submission
function submitReview(productId) {
    const product = document.getElementById(productId);
    const starsContainer = product.querySelector('.stars');
    const rating = parseInt(starsContainer.getAttribute('data-selected')) || 0;
    const reviewText = product.querySelector('.review-text').value.trim();

    if (rating === 0) { alert('Select a rating!'); return; }
    if (!reviewText) { alert('Write a review!'); return; }

    const reviewList = product.querySelector('.reviews-list');
    const reviewElem = document.createElement('div');
    reviewElem.className = 'review-item';

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) starsHtml += i <= rating ? '⭐' : '☆';
    reviewElem.innerHTML = `<div class="review-stars">${starsHtml}</div><p>${reviewText}</p>`;
    reviewList.prepend(reviewElem);

    starsContainer.querySelectorAll('.star').forEach(s => s.innerHTML = '☆');
    starsContainer.removeAttribute('data-selected');
    product.querySelector('.review-text').value = '';
}
