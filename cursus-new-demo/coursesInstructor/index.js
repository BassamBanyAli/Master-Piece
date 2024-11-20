async function myCourses() {
    debugger;
    // Retrieve the instructor ID from localStorage
    const id = localStorage.getItem("instructorId");

    // Define the API endpoint
    const url = `https://localhost:7246/api/Courses/getCourseForInstructor?id=${id}`;

    try {
        // Fetch data from the API
        const response = await fetch(url);

        // Handle 404 status for "No courses found"
        if (response.status === 404) {
            const result = await response.json();
            console.log(result.message); // Log the error message from the server
        
            // Display a styled "No Courses Found" message or the server's message
            const message = result.message || "No courses found for this instructor.";
            document.getElementById("container").innerHTML = `
                <div class="alert-box" style="padding: 20px; background-color: #f8d7da; border-radius: 5px; color: #721c24; text-align: center;">
                    <strong>none of the courses are confirmed yet</strong>
                </div>
            `;
            return;
        }

        // Check for other errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response as JSON
        const result = await response.json();
        console.log(result);

        // Get the container element
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear previous content

        // Loop through the courses and generate HTML for each course
        result.forEach((course) => {
            container.innerHTML += `
                <div class="col-lg-3 col-md-4">
                    <div class="fcrse_1 mt-30">
                        <a href="../courseDetailforInstructor/index.html" class="fcrse_img" onclick="handleCourseClick(${course.courseId})">
                            <img src="https://localhost:7246/uploads/${course.image}" alt="${course.courseName}">
                            <div class="course-overlay">
                                <span class="play_btn1"><i class="uil uil-play"></i></span>
                            </div>
                        </a>
                        <div class="fcrse_content">
                            <a href="../courseDetailforInstructor/index.html" class="crse14s" onclick="handleCourseClick(${course.courseId})">${course.courseName}</a>
                            <a href="../courseDetailforInstructor/index.html" class="crse-cate" onclick="handleCourseClick(${course.courseId})">${course.department}</a>
                            <div class="auth1lnkprce">
                                <p class="cr1fot">By <a href="#">${course.courseAuthor}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching courses:", error);

        // Display an error message
        document.getElementById("container").innerHTML = `
            <div class="alert-box" style="padding: 20px; background-color: #f8d7da; border-radius: 5px; color: #721c24; text-align: center;">
                <strong>Failed to load courses. Please try again later.</strong>
            </div>
        `;
    }
}

    
    
    
    function handleCourseClick(courseId) {
       // Store the courseId in localStorage
       localStorage.setItem('courseId', courseId);
    
       // Redirect to the course details page
       window.location.href = `../courseDetailforInstructor/index.html?courseId=${courseId}`;
    }
    myCourses();
    
    
    
    
    
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
    


    async function signOut() {
        debugger;
        localStorage.removeItem("id");
        window.location.href="Login/sign_in.html"
        
    }



    document.addEventListener("DOMContentLoaded", function() {
        const courseDataArray = JSON.parse(localStorage.getItem("newCourseDataArray")) || [];
        console.log(courseDataArray); // Check the value of courseDataArray
        const cartItemCount = courseDataArray.length;
        console.log(cartItemCount); // Check the item count
        
        const notiCountElement = document.querySelector(".noti_count");
        if (notiCountElement) {
            notiCountElement.textContent = cartItemCount;
        }
    });
    
    