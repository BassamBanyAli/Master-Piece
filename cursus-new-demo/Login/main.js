import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtGnVSesTU04x0JIjr-0scSNV8h0wKN84",
  authDomain: "best-team-173b4.firebaseapp.com",
  projectId: "best-team-173b4",
  storageBucket: "best-team-173b4.appspot.com",
  messagingSenderId: "347062803002",
  appId: "1:347062803002:web:ac1fa2f00439420013f303"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
  debugger
    googleLogin.addEventListener("click", async function () {
      try {
        console.log("Button clicked, attempting login...");
        const result = await signInWithPopup(auth, provider);
  
        const user = result.user;
        console.log("User:", user);
        
        var url = 'https://localhost:7246/api/Users/Google';
        
        // Create FormData object and append user details
        var formData = new FormData();
        formData.append('displayName', user.displayName);
        formData.append('email', user.email);
        formData.append('photoURL', user.photoURL);
        
        try {
            var response = await fetch(url, {
                method: "POST",
                body: formData,
            });
        
            if (response.ok) {
              var data = await response.json();
              if (data.token == null){
                alert('Registered successfully with Google');
                window.location.href = "createpassword.html";
              }else{
                window.location.href="../index.html";
              }

            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'Registration failed'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while registering. Please try again.');
        }
        
    localStorage.setItem("NameForChat",user.displayName);
        
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));
  
      } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
      }
    });
} else {
    console.error("Login button not found");
}
