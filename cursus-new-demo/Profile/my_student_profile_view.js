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