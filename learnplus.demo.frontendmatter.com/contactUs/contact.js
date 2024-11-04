async function getContactMessages() {
    const url = `https://localhost:7246/api/Users/allMessages`;
    const tableBody = document.getElementById("contactMessageList");
    const response = await fetch(url);
    const result = await response.json();

    result.forEach(element => {
        const row = document.createElement("tr");

        // Generate a mailto link with subject and message body
        const mailtoLink = `mailto:${element.email}?subject=Re:%20${encodeURIComponent(element.subject)}&body=Hello%20${encodeURIComponent(element.fullName)},%0D%0A%0D%0A[Your%20message%20here]`;

        // Create columns and append them to the row
        row.innerHTML = `
            <td>${element.fullName}</td>
            <td>${element.email}</td>
            <td>${element.phone}</td>
            <td>${element.subject}</td>
            <td>${element.createdAt ? new Date(element.createdAt).toLocaleDateString() : "N/A"}</td>
            <td>${element.message ? `<span>${element.message}</span>` : 'No message'}</td>
            <td>
                <a href="${mailtoLink}" class="btn btn-primary btn-sm">Reply</a>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Load contact messages when the page loads
getContactMessages();

function openModal(message) {
    const modal = document.getElementById("messageModal");
    const modalMessageContent = document.getElementById("modalMessageContent");

    modalMessageContent.textContent = message;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("messageModal");
    modal.style.display = "none";
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById("messageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Load contact messages when the page loads
getContactMessages();
