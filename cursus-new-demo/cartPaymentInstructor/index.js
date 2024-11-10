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
                const instructorId = localStorage.getItem("instructorId");
                console.log('Instructor ID:', instructorId);

                if (!instructorId) {
                    console.error('Instructor ID not found in localStorage.');
                    return;
                }

                // Step 1: Update CourseAuthor to "pending"
                const newCourseDataArray = JSON.parse(localStorage.getItem("newCourseDataArray") || "[]");

                if (newCourseDataArray.length === 0) {
                    console.warn('No courses found in newCourseDataArray.');
                    return;
                }

                const updateCoursePromises = newCourseDataArray.map(course => {
                    return fetch(`https://localhost:7246/api/Courses/updateCourseAuthor/${course.courseId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        console.log('Update CourseAuthor response status:', response.status);
                        if (!response.ok) {
                            throw new Error(`Failed to update CourseAuthor: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(updatedData => {
                        console.log(`Course ${course.courseId} author status updated to "pending":`, updatedData);
                    })
                    .catch(error => {
                        console.error(`Error updating CourseAuthor for courseId ${course.courseId}:`, error);
                    });
                });

                Promise.all(updateCoursePromises)
                .then(() => {

                    const paymentPromises = newCourseDataArray.map(course => {




                        const userPaymentDto = {
                            instructorId: parseInt(instructorId), // Ensure instructorId is an integer
                            CourseId: course.courseId,
                            Amount: course.price
                        };

                        console.log("Sending UserPayment:", userPaymentDto);

                        return fetch(`https://localhost:7246/api/InstructorPayment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userPaymentDto)
                        })
                        .then(response => {
                            console.log('UserPayment response status:', response.status);
                            if (!response.ok) {
                                return response.json().then(errorData => {
                                    throw new Error(`Error creating user payment: ${errorData.message}`);
                                });
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
                    // Clear newCourseDataArray from localStorage after successful payments
                    localStorage.removeItem("newCourseDataArray");

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
