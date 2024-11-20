async function featuredCources() {
	debugger;
    var url = `https://localhost:7246/api/Courses/getallcourses`;
    
    var response = await fetch(url);
    var result = await response.json();

    // Limit the courses to the first 4
    var featuredCourses = result.slice(0, 4);

    var container = document.getElementById("container");
	container.innerHTML = '';

    featuredCourses.forEach(element => {
        container.innerHTML += `	
        <div class="col-lg-3 col-md-4">
            <div class="fcrse_1 mt-30">
                <a href="course_detail_view.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                    <img src="https://localhost:7246/uploads/${element.image}" alt="">
                    <div class="course-overlay">
                        <span class="play_btn1"><i class="uil uil-play"></i></span>
                    </div>
                </a>
                <div class="fcrse_content">

                    <a href="course_detail_view.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                    <a href="course_detail_view.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                    <div class="auth1lnkprce">
                        <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                    </div>
                </div>													
            </div>
        </div>`;
    });
}



featuredCources();






async function recentCourses() {
    try {
        const url = `https://localhost:7246/api/Courses/getallcourses`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }
        
        const result = await response.json();

        // Get the current date and calculate two weeks ago
        const today = new Date();
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(today.getDate() - 14);

        // Filter courses based on createdAt (within the last two weeks)
        const recentCourses = result.filter(course => {
            const createdAt = course.createdAt ? new Date(course.createdAt) : null;
            return createdAt && createdAt >= twoWeeksAgo && createdAt <= today;
        });

        // Take only the first 4 recent courses
        const recentCoursesLimited = recentCourses.slice(0, 2);

        // Clear previous content in the container
        const container = document.getElementById("container2");
        if (!container) {
            console.error('Container element not found');
            return;
        }
        container.innerHTML = '';
        
        // Append recent courses to the container
        recentCoursesLimited.forEach(element => {
            container.innerHTML += `
                <div class="col-lg-3 col-md-4">
                    <div class="fcrse_1 mt-30">
                        <a href="course_detail_view.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                            <img src="https://localhost:7246/uploads/${element.image}" alt="">
                            <div class="course-overlay">
                                <span class="play_btn1"><i class="uil uil-play"></i></span>
                            </div>
                        </a>
                        <div class="fcrse_content">

                            <a href="course_detail_view.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                            <a href="course_detail_view.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                            <div class="auth1lnkprce">
                                <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                            </div>
                        </div>													
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching recent courses:', error);
    }
}
recentCourses();







async function get() {
    debugger;
    var url = `https://localhost:7246/api/Instructors/AllInstructors`;
    const container = document.getElementById("container3");

    // Fetch the instructor data from the API
    var response = await fetch(url);
    var result = await response.json();
    console.log(result);

    // Limit the number of displayed instructors to 4
    const recentCoursesLimited = result.slice(0, 4);

    // Clear the container before appending new data
    container.innerHTML = '';

    // Loop through the limited set of instructors
    recentCoursesLimited.forEach(element => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4">
                <div class="fcrse_1 mt-30" onclick="navigateToProfile(${element.instructorId})">
                    <div class="tutor_img">
                        <img src="https://localhost:7246/uploads/${element.image}" alt="Instructor Image">
                    </div>
                    <div class="tutor_content_dt">
                        <div class="tutor150">
                            <a class="tutor_name">${element.fullName}</a>
                            <div class="mef78" title="Verify">
                                <i class="uil uil-check-circle"></i>
                            </div>
                        </div>
                        <div class="tutor_cate">${element.department || 'Department Not Available'}</div>

                    </div>
                </div>
            </div>
        `;
    });
    
}

function navigateToProfile(instructorId) {
    debugger;
    // Save the instructor ID in local storage
    localStorage.setItem("instructorId", instructorId);
    
    // Navigate to the instructor profile page
    window.location.href = '../instructor_profile_view.html';
}

get();















function handleCourseClick(element) {
	debugger;
    var courseId = element;
    localStorage.setItem('courseId', courseId);
    window.location.href = 'course_detail_view.html';
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


