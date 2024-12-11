document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    // Default user
    const defaultUser = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@waistmanagement.com',
        password: 'admin123'
    };
    localStorage.setItem(defaultUser.email, JSON.stringify(defaultUser));

    //Register and login
    //Regsiters new user
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Check if email is already in use
            if (localStorage.getItem(email)) {
                alert('Email is already in use.');
                return;
            }

            // Create user object
            const user = {
                firstName,
                lastName,
                email,
                password
            };

            // Save user to local storage
            localStorage.setItem(email, JSON.stringify(user));
            alert('Registration successful!');
            registerForm.reset();
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = '../Pages/index.html';
        });
    }

    //Logs in exitsing user
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Get user from local storage
            const user = JSON.parse(localStorage.getItem(email));

            // Check if user exists and password is correct
            if (user && user.password === password) {
                alert(`Welcome back, ${user.firstName} ${user.lastName}!`);
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = '../index.html';
            } else {
                alert('Invalid email or password.');
            }

            loginForm.reset();
        });
    }

    if (window.location.pathname.includes('invoice.html')) {
        generateInvoice();
    }

    //Only Display cart if user is logged in
    if (window.location.pathname.includes('Cart.html')) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert('You must be logged in to view the cart.');
            window.location.href = 'login.html';
        } else {
            displayCartItems();
        }
    }
});

//Creates a list of services
const products = [
    { id: 1, name: 'Personal Training', price: 50 },
    { id: 2, name: 'Group Classes', price: 30 },
    { id: 3, name: 'Nutrition Counseling', price: 40 },
    { id: 4, name: 'Massage therapy', price: 60 },
    { id: 5, name: 'Physical Therapy', price: 70 },
    { id: 6, name: 'Specialized Training', price: 80 },
    { id: 7, name: 'Swim Classes', price: 25 },
    { id: 8, name: 'Yoga Classes', price: 20 },
    { id: 9, name: 'The Ultimate Package', price: 100 }
];

//Displays the services
function addToCart(productId, quantity) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    //Only logged in users can add to cart
    if (!loggedInUser) {
        alert('You must be logged in to add items to the cart.');
        window.location.href = 'login.html';
        return;
    }

    //Find the product by id
    const product = products.find(p => p.id === productId);
    //If product is found, add to cart
    if (product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += parseInt(quantity);
        } else {
            cart.push({ ...product, quantity: parseInt(quantity) });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} (x${quantity}) added to cart.`);
    }
}

//Clears the cart
function cancelCart() {
    localStorage.removeItem('cart');
    alert('Cart has been cleared.');
    location.href = 'services.html';
}

//Shows invoice after checkout
function checkout() {
    location.href = 'invoice.html';
}

//Displays the cart items
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    //If cart is empty, display message
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    //Display cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

//Generates the invoice
function generateInvoice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    let tax = 0;
    let discount = 0;
    let total = 0;
    const invoiceNumber = Math.floor(Math.random() * 1000000); //Random invoice number

    let invoiceDetails = `<p>Invoice Number: ${invoiceNumber}</p>`;//Prints invoice number

    //Display items 
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        invoiceDetails += `<p>${item.name} for ${item.quantity} Months - $${(item.price * item.quantity).toFixed(2)}</p>`;
    });

    tax = subtotal * 0.15; // 15% tax
    discount = subtotal * 0.10; // 10% discount
    total = subtotal + tax - discount; 

    invoiceDetails += `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <p>Discount: $${discount.toFixed(2)}</p>
        <p>Total: $${total.toFixed(2)}</p>
    `;

    document.getElementById('invoice-details').innerHTML = invoiceDetails;
}

function printInvoice() {
    window.print();
}

//Allows user to download invoice
function downloadInvoice() {
    const invoiceDetails = document.getElementById('invoice-details').innerHTML;
    const blob = new Blob([invoiceDetails], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.html';
    link.click();
}
