function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
        },
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: "0.99" // Use string format for value
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

                // Fetch user ID from localStorage
                const userId = localStorage.getItem("id");
                console.log('User ID:', userId);

                if (!userId) {
                    console.error('User ID not found in localStorage.');
                    return;
                }

                // Step 1: Create the Student
                fetch(`https://localhost:7246/api/Students/createStudents?id=${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log('Create Student response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Failed to create student: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(studentData => {
                    console.log('Student created successfully:', studentData);

                    // Store the student ID if needed
                    localStorage.setItem("studentId", studentData.studentId);

                    // Step 2: Process User Payments for each course
                    const courseDataArray = JSON.parse(localStorage.getItem("courseDataArray") || "[]");
                    console.log('Course Data Array:', courseDataArray);

                    if (courseDataArray.length === 0) {
                        console.warn('No courses found in courseDataArray.');
                        return;
                    }

                    const paymentPromises = courseDataArray.map(course => {
                        // Extract numerical value from price string
                        const priceMatch = course.price.match(/\d+(\.\d+)?/);
                        const amount = priceMatch ? parseFloat(priceMatch[0]) : 0;

                        if (isNaN(amount) || amount <= 0) {
                            console.error(`Invalid amount for courseId ${course.courseId}:`, course.price);
                            return Promise.reject(new Error(`Invalid amount for courseId ${course.courseId}`));
                        }

                        const userPaymentDto = {
                            UserId: userId,
                            CourseId: course.courseId,
                            Amount: amount // Use the extracted number
                        };

                        console.log("Sending UserPayment:", userPaymentDto);

                        // Send POST request to create UserPayment
                        return fetch(`https://localhost:7246/api/UserPayments`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userPaymentDto)
                        })
                        .then(response => {
                            console.log('UserPayment response status:', response.status);
                            if (!response.ok) {
                                throw new Error(`Error creating user payment: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(paymentData => {
                            console.log('User payment created successfully:', paymentData);
                        })
                        .catch(error => {
                            console.error('Error creating user payment:', error);
                        });
                    });

                    return Promise.all(paymentPromises);
                })
                .then(() => {
                    // Clear courseDataArray from localStorage after successful payments
                    localStorage.removeItem("courseDataArray");

                    // Display a success message and the 'Return to Home' button
                    const element = document.getElementById('paypal-button-container');
                    element.innerHTML = '<h3>Thank you for your payment!</h3><button id="returnToIndexBtn" onclick="returnToIndex()">Return to Home</button>';
                })
                .catch(error => {
                    console.error('Error in payment process:', error);
                });
            });
        },
        onError: function (err) {
            console.error('PayPal Error:', err);
        }
    }).render('#paypal-button-container'); // Renders the PayPal button
}

// Function to handle the redirection after button click
function returnToIndex() {
    window.location.href = "../index.html"; // Redirect to the home page
}

// Initialize PayPal button on page load
window.onload = initPayPalButton;