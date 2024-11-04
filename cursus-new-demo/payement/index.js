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
                var id = localStorage.getItem("id");
debugger;
                fetch(`https://localhost:7246/api/Students/createStudents?id=${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Student created successfully:', data);
                    localStorage.setItem("studentId",data.studentId);
                     window.location.href="../index.html";
                    // Add success handling logic here
                    localStorage.removeItem("courseDataArray");
                    console.log("courseDataArray removed from localStorage.");
                })
                .catch(error => {
                    console.error('Error creating student:', error);
                });
                



                const element = document.getElementById('paypal-button-container');
                element.innerHTML = '<h3>Thank you for your payment!</h3>';
                
            });
        },
        onError: function (err) {
            console.error('PayPal Error:', err);
        }
    }).render('#paypal-button-container'); // Renders the PayPal button
}

// Initialize PayPal button on page load
window.onload = initPayPalButton;
