async function Register(event) {
    event.preventDefault();
    debugger;

    var form = document.getElementById("form");
    var formData = new FormData(form);


    var password = formData.get("password");
    var repeatPassword = formData.get("repeatepassword");


    if (password !== repeatPassword) {
        alert('Passwords do not match. Please make sure both passwords are the same.');
        return; 
    }

    var url = 'https://localhost:7246/api/Users/register';

    try {
        var response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert('Registered successfully');
            var result=await response.json();
            localStorage.setItem("id",result.userId);
            window.location.href = "sign_up_steps.html";
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again.');
    }
}