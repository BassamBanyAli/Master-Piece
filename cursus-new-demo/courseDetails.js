async function getProfile() {
    debugger;
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
    const courseId = localStorage.getItem("courseId");
    // Get the content or values of the elements
    const description = document.getElementById("description").innerText;
    const name = document.getElementById("courseName").innerText;
    const title = document.getElementById("courseTitle").innerText;
    const price = document.getElementById("coursePrice").innerText;
    const image=localStorage.getItem("image");
    const courseAuth=localStorage.getItem("courseAuth");

    // Create a new course object
    const newCourseData = {
        courseId,
        image,
        description,
        name,
        title,
        price,
        courseAuth
    };

    // Retrieve existing array from localStorage or initialize an empty array
    let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];

    // Check if the course with the same courseId already exists
    const courseExists = courseDataArray.some(course => course.courseId === courseId);

    // If course doesn't exist, add it to the array and save back to localStorage
    if (!courseExists) {
        courseDataArray.push(newCourseData);
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