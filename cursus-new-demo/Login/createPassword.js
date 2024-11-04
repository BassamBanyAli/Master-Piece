async function CreatePassword(event) {
    event.preventDefault();  // Prevent form submission and page reload
    debugger;
    var url = 'https://localhost:7246/api/Users/CreatePassword';
    var data = JSON.parse(localStorage.getItem("user"));
    if (!data || !data.displayName) {
        alert('User data is missing. Please log in again.');
        return;
    }
    

    var form = document.getElementById("form1");
    var formData = new FormData();
    var password1 = document.getElementById("Password").value;
    var password2 = document.getElementById("confirmPassword").value;
    formData.append('displayName', data.displayName);
    if (password1 !== password2) {
        alert("Passwords do not match");
        return;
    }

    formData.append('Password', password1);


    try {
        var response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        var dataUser= await response.json();
        localStorage.setItem("id",dataUser);

        if (response.ok) {
            alert('Password changed successfully');
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Password change failed'));
        }
        
        var response2=await fetch(`https://localhost:7246/api/Users/getProfile?userId=${dataUser}`);
        var result2=await response2.json();
        if(result2.about==null){
            window.location.href = "sign_up_steps.html";
        }
        else if(localStorage.getItem("fromotp")==1){
            window.location.href="sign_in.html";
        }
        else
        window.location.href="../beforeLogin/indexBeforeLogin.html";

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while changing the password. Please try again.');
    }


}