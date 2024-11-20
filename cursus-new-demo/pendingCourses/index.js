async function pendingCourses() {
    debugger;
    // Get instructorId from localStorage
    var id = localStorage.getItem("instructorId");

    // Check if instructorId exists, if not handle the error
    if (!id) {
        console.error("Instructor ID is missing in localStorage.");
        return;
    }

    // Define the URL to fetch courses for the instructor with 'pending' as author
    var url = `https://localhost:7246/api/Courses/pending/${id}`;

    try {
        // Make the API call to fetch courses
        var response = await fetch(url);

        // Check if the response status is OK (200) or NotFound (404)
        if (response.status === 404) {
            // If no courses are found, show a specific message
            var result = await response.json();
            console.log(result.message); // Log the message from the server

            // Inject styled message for "No pending courses found"
            document.getElementById("container").innerHTML = `
                <div class="alert-box">
                    <p><strong>No Pending Courses Found</strong></p>
          
                </div>
            `;
            return;
        }

        // If response is OK (200), parse the result
        if (response.ok) {
            var result = await response.json();
            
            // Log the result for debugging
            console.log(result);

            // Get the container element to display the courses
            var container = document.getElementById("container");

            // Clear the container before appending new courses
            container.innerHTML = '';

            // Loop through the result and generate HTML for each course
            result.forEach(element => {
                // Add a div for each course with course details
                container.innerHTML += `
                    <div class="col-lg-3 col-md-4">
                        <div class="fcrse_1 mt-30">
                            <a href="../courseDetailforInstructor/index.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                                <img src="https://localhost:7246/uploads/${element.image}" alt="">
                                <div class="course-overlay">
                                    <span class="play_btn1"><i class="uil uil-play"></i></span>
                                </div>
                            </a>
                            <div class="fcrse_content">
                                <a href="../courseDetailforInstructor/index.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                                <a href="../courseDetailforInstructor/index.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>

                            </div>                                                    
                        </div>
                    </div>
                `;
            });
        } else {
            // Handle other non-OK responses if needed
            console.error("Failed to fetch data:", response.status);
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

// Handle course click by saving the courseId in localStorage and redirecting
function handleCourseClick(courseId) {
    debugger;
    // Store the courseId in localStorage
    localStorage.setItem('courseId', courseId);

    // Redirect to the course details page
    window.location.href = `../courseDetailforInstructor/index.html`;
}

// Call the function to load the pending courses
pendingCourses();


    
    
    
    
    
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
    
    