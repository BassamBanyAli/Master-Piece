async function getotp(event) {
    debugger;
    event.preventDefault();
    var id=localStorage.getItem("varificationId");
    var url=`https://localhost:7246/api/Users/GetOTP?id=${id}`;
    var form=document.getElementById("form1");
    var formData=new FormData(form);
    var response=await fetch(url,{
        method:"POST",
        body:formData
    });
    if(response.ok){
        localStorage.setItem("fromotp",1);
        window.location.href="createPassword.html";
    }
    
}