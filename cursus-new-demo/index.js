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
                <a href="courseDetail.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                    <img src="https://localhost:7246/uploads/${element.image}" alt="">
                    <div class="course-overlay">
                        <span class="play_btn1"><i class="uil uil-play"></i></span>
                    </div>
                </a>
                <div class="fcrse_content">
                    <div class="vdtodt">
                        <span class="vdt14">109k views</span>
                        <span class="vdt14">15 days ago</span>
                    </div>
                    <a href="courseDetail.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                    <a href="courseDetail.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.departement}</a>
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
        const recentCoursesLimited = recentCourses.slice(0, 4);

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
                        <a href="courseDetail.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                            <img src="https://localhost:7246/uploads/${element.image}" alt="">
                            <div class="course-overlay">
                                <span class="play_btn1"><i class="uil uil-play"></i></span>
                            </div>
                        </a>
                        <div class="fcrse_content">
                            <div class="vdtodt">
                                <span class="vdt14">109k views</span>
                                <span class="vdt14">15 days ago</span>
                            </div>
                            <a href="courseDetail.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                            <a href="courseDetail.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.departement}</a>
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

    // Limit the number of displayed instructors to 4
    const recentCoursesLimited = result.slice(0, 4);

    // Clear the container before appending new data
    container.innerHTML = '';

    // Loop through the limited set of instructors
    recentCoursesLimited.forEach(element => {
        // Create columns and append them to the row
        container.innerHTML += `
            <div class="col-lg-3 col-md-4">
                <div class="fcrse_1 mt-30">
                    <div class="tutor_img">
                        <a href="../instructor_profile_view.html">
                            <img src="https://localhost:7246/uploads/${element.image}" alt="Instructor Image">
                        </a>
                    </div>
                    <div class="tutor_content_dt">
                        <div class="tutor150">
                            <a href="../instructor_profile_view.html" class="tutor_name">${element.fullName}</a>
                            <div class="mef78" title="Verify">
                                <i class="uil uil-check-circle"></i>
                            </div>
                        </div>
                        <div class="tutor_cate">${element.department || 'Department Not Available'}</div>

                        <div class="tut1250">
                            <span class="vdt15">100K Students</span>
                            <span class="vdt15">15 Courses</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

get();















function handleCourseClick(element) {
	debugger;
    var courseId = element;
    localStorage.setItem('courseId', courseId);
window.location.href = 'courseDetail.html';

}

async function signOut() {
    debugger;
    localStorage.removeItem("id");
    window.location.href="Login/sign_in.html"
    
}


