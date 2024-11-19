async function myCourses() {
    debugger;
    const id = localStorage.getItem("id");
    const url = `https://localhost:7246/api/Courses/getCoursesPaid?id=${id}`;

    // Fetch courses data
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);

    // Cache fetched data for searching
    let courses = result;

    // Get the container for displaying courses
    const container = document.getElementById("container");
    container.innerHTML = "";

    // Function to render courses
    function renderCourses(coursesToDisplay) {
        // Clear previous content
        container.innerHTML = ""; 

        if (coursesToDisplay.length === 0) {
            // If no courses, display a message
            const noCoursesMessage = document.createElement("div");
            noCoursesMessage.className = "no-courses-message";
            noCoursesMessage.style.textAlign = "center";
            noCoursesMessage.style.marginTop = "20px";
            noCoursesMessage.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <strong>No courses available.</strong> You have not any courses.
                </div>
            `;
            container.appendChild(noCoursesMessage);
            return; // Stop further rendering if no courses are available
        }

        // Render the courses
        coursesToDisplay.forEach(element => {
            container.innerHTML += `
                <div class="col-lg-3 col-md-4">
                    <div class="fcrse_1 mt-30">
                        <a href="../mycourse/index.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                            <img src="https://localhost:7246/uploads/${element.image}" alt="">
                            <div class="course-overlay">
                                <span class="play_btn1"><i class="uil uil-play"></i></span>
                            </div>
                        </a>
                        <div class="fcrse_content">
                            <a href="../mycourse/index.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                            <a href="../mycourse/index.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                            <div class="auth1lnkprce">
                                <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                            </div>
                        </div>                                                    
                    </div>
                </div>`;
        });
    }

    // Initial render of all courses
    renderCourses(courses);

    // Add search functionality
    const searchInput = document.querySelector(".prompt.srch_explore");
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCourses = courses.filter(course =>
            course.courseName.toLowerCase().includes(searchTerm) ||
            course.department.toLowerCase().includes(searchTerm) ||
            course.courseAuthor.toLowerCase().includes(searchTerm)
        );
        renderCourses(filteredCourses);
    });
}







function handleCourseClick(courseId) {
   // Store the courseId in localStorage
   localStorage.setItem('courseId', courseId);

   // Redirect to the course details page
   window.location.href = `course_detail_view.html?courseId=${courseId}`;
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

async function signOut() {
    debugger;
    localStorage.removeItem("id");
    window.location.href="Login/sign_in.html"
    
}



