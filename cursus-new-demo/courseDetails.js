async function getProfile() {

    var id = localStorage.getItem("id");
    var url = `https://localhost:7246/api/Users/getProfile?userId=${id}`;

    try {
        var response = await fetch(url, {
            method: "GET"
        });

        if (response.ok) {
            var result = await response.json();

            // Update the profile image, name, and email
            document.getElementById("profile-image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementById("firstProfile-image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementById("profile-name").textContent = result.fullName;
            document.getElementById("profile-email").textContent = result.email;

        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Profile retrieval failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while retrieving the profile. Please try again.');
    }
}

getProfile();









async function course_details() {
    try {
        // Get the course ID from localStorage
        const courseId = localStorage.getItem("courseId");
        if (!courseId) {
            throw new Error('Course ID not found in localStorage');
        }

        // Define the URL with the course ID (make sure to properly encode the URL)
        const url = `https://localhost:7246/api/Courses/getCourse?id=${courseId}`;

        // Fetch the course details from the API
        const response = await fetch(url);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();

        localStorage.setItem("courseAuth",result.courseAuthor);

        // Get the elements where data will be displayed
        const description = document.getElementById("description");
        const name = document.getElementById("courseName");
        const title = document.getElementById("courseTitle");
        const department = document.getElementById("department");
        const price = document.getElementById("coursePrice");
        const date = document.getElementById("date");
        const videoPlayer = document.getElementById("videoPlayer");
        const image = document.getElementById("image");


localStorage.setItem("instructorId",result.instructorId);
        var messageButton = document.createElement("button");
        messageButton.className = "subscribe-btn btn500";
        messageButton.textContent = "View Instructor Profile";
        messageButton.onclick = function () {
            window.location.href = "instructor_profile_viewLogin.html";
        };
        
        document.getElementById("messageButtonContainer").appendChild(messageButton);



        // Convert createdAt to Date object and format it
        const createdAtDate = new Date(result.createdAt); // Convert string to Date object
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = createdAtDate.toLocaleDateString('en-US', options); // Format date

        // Set the content with data from the result
        description.innerHTML = result.courseDescription || 'No description available';
        name.innerHTML = result.courseName || 'No name available';
        title.innerHTML = result.courseTitle || 'No title available';
        department.innerHTML = result.department || 'No department available';
        price.innerHTML = "Price is $" + result.price || 'No price available';
        date.innerHTML = formattedDate; // Display formatted date
        videoPlayer.src = result.tutorialVideo;
        image.src = `https://localhost:7246/uploads/${result.image}`; // Use result.image
        localStorage.setItem("image", result.image);

    } catch (error) {
        console.error('Error fetching course details:', error);
    }
}

// Call the function
course_details();






async function saveInLocalStorage() {
    debugger;
    const courseId = localStorage.getItem("courseId");
    const studentId = localStorage.getItem("studentId");

    // Define default course object
    const courseDefaults = {
        description: document.getElementById("description").innerText || "",
        name: document.getElementById("courseName").innerText || "",
        title: document.getElementById("courseTitle").innerText || "",
        price: document.getElementById("coursePrice").innerText || "",
        image: localStorage.getItem("image") || "",
        courseAuth: localStorage.getItem("courseAuth") || ""
    };

    try {
        // If studentId is not in localStorage, directly add course to localStorage
        if (!studentId) {
            addToLocalStorage(courseId, courseDefaults);
            alert("You added this course to your cart.");
            location.reload();
            return;
        }

        // Call API to check enrollment
        const apiUrl = `https://localhost:7246/api/CartItems/CheckEnrollment?studentId=${studentId}&courseId=${courseId}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            alert("You already bought this course."); // Show success message
        } else if (response.status === 404) {
            // Course not enrolled, add to localStorage
            addToLocalStorage(courseId, courseDefaults);
            alert("You added this course to your cart."); // Show success message
        } else {
            alert("An unexpected error occurred.");
        }
    } catch (error) {
        console.error("Error checking enrollment:", error);
        alert("Failed to check enrollment. Please try again later.");
    }
}

// Helper function to handle adding course to localStorage
function addToLocalStorage(courseId, courseData) {
    // Retrieve existing array from localStorage or initialize an empty array
    let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];

    // Check if the course with the same courseId already exists
    const courseExists = courseDataArray.some(course => course.courseId === courseId);

    // If course doesn't exist, add it to the array and save back to localStorage
    if (!courseExists) {
        courseDataArray.push({ courseId, ...courseData });
        localStorage.setItem("courseDataArray", JSON.stringify(courseDataArray));
    }
}















async function checkAndSwitchTab() {
    debugger;
    const courseId = localStorage.getItem("courseId");
    var id = localStorage.getItem("id");
    var url=`https://localhost:7246/api/Courses/checkIsMyCourse?courseId=${courseId}&id=${id}`
var response=await fetch(url);
if(response.ok){

window.location.href="myCourse/index.html"
}
else{
    alert("you need to buy the course");
    new bootstrap.Tab(document.getElementById('nav-about-tab')).show();
}
}



async function content() {

    var id=localStorage.getItem("id");

    if(id===null){

        window.location.href="../Login/sing_in.html";
    }
    
}








document.addEventListener("DOMContentLoaded", function() {
    const courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];
    console.log(courseDataArray); // Check the value of courseDataArray
    const cartItemCount = courseDataArray.length;
    console.log(cartItemCount); // Check the item count
    
    const notiCountElement = document.querySelector(".noti_count");
    if (notiCountElement) {
        notiCountElement.textContent = cartItemCount;
    }
});
