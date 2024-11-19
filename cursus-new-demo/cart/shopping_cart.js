async function getItems() {
    let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];
    let container = document.getElementById("container");
    let totalPriceElement = document.getElementById("total");
    let totalAfterDiscount = document.getElementById("totalAfterDiscount");

    // Clear previous content
    container.innerHTML = '';
    totalPriceElement.innerHTML = '';
    totalAfterDiscount.innerHTML = '';

    if (courseDataArray.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <h2>Your Cart is Empty!</h2>
                <p>It seems you haven't added any courses to your cart yet.</p>
                <p>Start exploring our courses to find what you love!</p>
                <a href="../beforeLogin/explore.html" class="browse-courses-btn">Browse Courses</a>
            </div>
        `;
        totalPriceElement.innerHTML = '0.00';
        totalAfterDiscount.innerHTML = '0.00';
        return; // Exit the function early if the cart is empty
    }
    let totalPrice = 0;

    courseDataArray.forEach((element, index) => {
        // Clean price to ensure it's a number
        let price = parseFloat(element.price.toString().replace(/[^0-9.]/g, '')) || 0;

        // Append course details to container
        container.innerHTML += `
            <div class="fcrse_1" id="course-${index}">
                <a href="../course_detail_view.html" class="hf_img">
                    <img class="cart_img" src="https://localhost:7246/uploads/${element.image}" alt="">
                </a>
                <div class="hs_content">
                    <div class="eps_dots eps_dots10 more_dropdown">
                        <a onclick="removeItem(${index})"><i class='uil uil-times'></i></a>
                    </div>
                    <a href="../course_detail_view.html" class="crse14s title900 pt-2">${element.name}</a>
                    <a href="../#" class="crse-cate">${element.title}</a>
                    <div class="auth1lnkprce">
                        <p class="cr1fot">By <a href="../#">${element.courseAuth}</a></p>
                        <div class="prce142">${price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;

        // Accumulate total price
        totalPrice += price;
    });

    // Display total price
    totalPriceElement.innerHTML = totalPrice.toFixed(2);
    totalAfterDiscount.innerHTML = totalPrice.toFixed(2);

    // Save total price in local storage
    localStorage.setItem("totalPrice", totalPrice.toFixed(2));
}

// Call the function to populate items and calculate total price
getItems();



function isLoggedIn() {
    const id = localStorage.getItem('id');
    return id !== null;
}

function redirectToCheckout() {
    if (isLoggedIn()) {
        saveToCartTable();
        window.location.href = '../payement/index.html'; // Navigate to checkout page

    } else {
        alert('You need to log in first.');
        window.location.href = '../Login/sign_in.html'; // Redirect to login page
    }
}

// Example usage
document.getElementById('checkoutButton').addEventListener('click', redirectToCheckout);

function removeItem(index) {
    // Get current array from local storage
    let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];

    // Remove the item at the given index
    courseDataArray.splice(index, 1);

    // Update local storage with the new array
    localStorage.setItem("courseDataArray", JSON.stringify(courseDataArray));

    // Remove the card from the DOM
    document.getElementById(`course-${index}`).remove();

    // Recalculate and update total price
    getItems();
}

async function saveToCartTable() {
    debugger;
    const id = localStorage.getItem('id'); // User ID stored in localStorage
    if (id !== null) {
        // Retrieve the courseDataArray from localStorage
        let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray"));

        // Create an array of AddToCartDTOs with UserId and CourseId
        const cartItems = courseDataArray.map(course => {
            return {
                UserId: id,           // User ID from localStorage
                CourseId: course.courseId // Course ID from the courseDataArray
            };
        });

        try {
            // Define the API URL
            var url = `https://localhost:7246/api/CartItems/AddToCart`;

            // Send the POST request with cartItems array as the body
            var response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItems) // Convert the cartItems array to JSON
            });

            if (response.ok) {
                console.log("Items successfully added to the cart.");
            } else {
                console.error('Error adding items to cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    } else {
        console.error("User ID not found in localStorage.");
    }
}





getProfile();

