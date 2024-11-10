async function getProfile() {
    var id=localStorage.getItem("id");
     var url=`https://localhost:7246/api/Users/getProfile?userId=${id}`;

    
     try {
        var response = await fetch(url, {
            method: "GET"
        });

        if (response.ok) {
            var result= await response.json();
            document.getElementsByClassName("name")[0].textContent = result.fullName;
            document.getElementById("name").textContent=result.fullName;
            document.getElementById("image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementsByClassName("debartement")[0].textContent = result.debartement;
            document.getElementById("Department").textContent=result.debartement;
            document.getElementById("email").textContent = `Email: ${result.email || "No email available"}`;
            document.getElementsByClassName("about")[0].textContent = result.about;



        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again.');
    }
}
getProfile();




async function orders() {
    debugger;
    const id = localStorage.getItem("instructorId");
    const url = `https://localhost:7246/api/InstructorPayment/GetOrdersByInstructor/${id}`;
    const response = await fetch(url);
    const result = await response.json();

    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Clear any previous orders

    if (result.length === 0) {
        ordersList.innerHTML = "<p>No orders found.</p>";
        return;
    }

    result.forEach(order => {
        const row = `
            <tr>
                <td>${order.paymentId}</td>
                <td>${order.courseName}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td>${order.paymentStatus}</td>
                <td>${order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : "N/A"}</td>
                <td>${order.paymentType}</td>
            </tr>`;
        ordersList.insertAdjacentHTML("beforeend", row);
    });
}

orders();
