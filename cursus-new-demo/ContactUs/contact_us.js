async function contactUs(event) {
    event.preventDefault();
    var url=`https://localhost:7246/api/Users/contactUS`;
    var formData = new FormData(form);
    var response=await fetch(url,{
        method: "POST",
            body: formData,
    });


    if (response.ok) {
        alert('send email successfully');
    }
    
}