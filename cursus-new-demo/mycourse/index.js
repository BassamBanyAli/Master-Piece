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

        // Get the elements where data will be displayed
        const description = document.getElementById("description");
        const name = document.getElementById("courseName");
        const title = document.getElementById("courseTitle");
        const department = document.getElementById("department");

        const date = document.getElementById("date");
        const videoPlayer = document.getElementById("videoPlayer");
        const image = document.getElementById("image");


localStorage.setItem("instructorId",result.instructorId);
        var messageButton = document.createElement("button");
        messageButton.className = "subscribe-btn btn500";
        messageButton.textContent = "View Instructor Profile";
        messageButton.onclick = function () {
            window.location.href = "../instructor_profile_viewLogin.html";
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

        date.innerHTML = formattedDate; // Display formatted date
        videoPlayer.src = result.tutorialVideo;
        image.src = `https://localhost:7246/uploads/${result.image}`; // Use result.image
        localStorage.setItem("image", result.image);
        localStorage.setItem('videoSrc', result.tutorialVideo);

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

    // Create a new course object
    const newCourseData = {
        courseId,
        image,
        description,
        name,
        title,
        price
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



async function getContent() {
    debugger;

    // Check if user is logged in
    var id = localStorage.getItem("id");

    if (id === null) {
        window.location.href = "../Login/sing_in.html";
        return;
    }

    try {
        // Retrieve the course ID from local storage
        const courseId = localStorage.getItem("courseId");
        const url = `https://localhost:7246/api/Courses/getSections?id=${courseId}`;

        // Fetch sections data for the specific course
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const container = document.getElementById("accordion");
        container.innerHTML = ""; // Clear existing content

        // Loop through each section and create HTML structure
        result.forEach(section => {
            // Create the main section container
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("lecture-container");

            // Left content (icon and section title)
            sectionDiv.innerHTML = `
                <div class="left-content">
                    <i class='uil uil-file-download-alt icon_142'></i>
                    <div class="top">
                        <div class="title">${section.sectionTitle}</div>
                    </div>
                </div>
                <div class="details">
                    <a href="javascript:void(0);" class="preview-text" onclick="openVideoModal('${section.videoLink}')">Preview</a>

                </div>
            `;

            // Append the section container to the accordion
            container.appendChild(sectionDiv);
        });

    } catch (error) {
        console.error("Error fetching content:", error);
        alert("An error occurred while loading course sections. Please try again later.");
    }
}

function openVideoModal(videoUrl) {
    // Set the iframe src to the provided video URL
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.src = videoUrl;
    console.log("Video URL set:", videoUrl);
    // Show the modal
    const videoModal = new bootstrap.Modal(document.getElementById('videoModal'), {});
    videoModal.show();
}


async function signOut() {
    debugger;
    localStorage.removeItem("id");
    window.location.href="../Login/sign_in.html"
    
}








// Call the function to load content when the page loads

// Modal event listeners











