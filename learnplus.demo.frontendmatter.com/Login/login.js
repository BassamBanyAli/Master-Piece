

async function login(event) {
    debugger;
    event.preventDefault();
    var url = 'https://localhost:7246/api/Admin/login';
    var form = document.getElementById("form");
    var formData = new FormData(form);

    try {
        var response = await fetch(url, {
            method: "POST",
            body: formData,
          
        });
        console.log(response)

        if (response.ok) {
            var result = await response.json();
            localStorage.setItem('jwtToken', result.token);
            localStorage.setItem('userIdAdmin', result.userIdAdmin);
            alert('Logged in successfully');
            window.location.href="../dashboard/student-dashboard.html";
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Email or password is incorrect'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again.');
    }
}


        
    



 
