async function sendemail(event) {
debugger;
    event.preventDefault();

    // API URL
    var url = 'https://localhost:7246/api/Users/send';

    // Get the form data
    var form = document.getElementById("form");
    var formData = new FormData(form);

    try {

        var response = await fetch(url, {
            method: "POST", 
            body: formData 
        });

 
        if (response.ok) {
            var result = await response.json();
            alert("Verification code sent successfully! OTP: " + result.otp);

            var email=document.getElementById("id_email").value;
            localStorage.setItem("email",email);
            localStorage.setItem("varificationId",result.userId);
            window.location.href="OTP.html";
        } else {
            throw new Error("Failed to send verification email.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error sending email: " + error.message);
    }
}
