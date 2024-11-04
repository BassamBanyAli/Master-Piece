

async function login(event) {
    debugger;
    event.preventDefault();
    var url = 'https://localhost:7246/api/Users/login';
    var form = document.getElementById("form");
    var formData = new FormData(form);
    localStorage.setItem("fromotp",0);

    try {
        var response = await fetch(url, {
            method: "POST",
            body: formData,
          
        });
        console.log(response)

        if (response.ok) {
            debugger;
            var result = await response.json();
            localStorage.setItem('jwtToken', result.token);
            localStorage.setItem('id', result.userId);
            alert('Logged in successfully');
            window.location.href="../index.html";
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Email or password is incorrect'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again.');
    }
}


        
    



 
