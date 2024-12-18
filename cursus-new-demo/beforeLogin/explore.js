async function explore() {
    debugger;
    var url = `https://localhost:7246/api/Courses/getallcourses`;
    var response = await fetch(url);
    var result = await response.json();

    var container = document.getElementById("container");
    container.innerHTML = ''; // Clear existing content before adding new

    result.forEach(element => {
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

                        <a id="courseName" href="course_detail_view.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                        <a id="courseDebartment" href="course_detail_view.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                        <div class="auth1lnkprce">
                            <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                            <div id="coursePrice" class="prce142">$${element.price}</div>
                            <button class="shrt-cart-btn" title="cart">
                                <i class="uil uil-shopping-cart-alt" onclick="saveInLocalStorage(${element.courseId})"></i>
                            </button>
                        </div>
                    </div>
                </div>                                                     
            </div>`;
    });
}

async function searchCourses(query) {
    const url = `https://localhost:7246/api/Courses/search?query=${encodeURIComponent(query)}`; // Build the search URL

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json(); // Parse the JSON response
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            container.innerHTML = '<p>No courses found.</p>'; // Display a message if no courses found
            return;
        }

        results.forEach(element => {
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
                            <div class="prce142">$${element.price}</div>
                            <button class="shrt-cart-btn" title="cart">
                                <i class="uil uil-shopping-cart-alt" onclick="saveInLocalStorage(${element.courseId})"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Function to handle input changes
function handleSearchInput() {
    const searchQuery = document.getElementById('searchQuery').value;
    if (searchQuery) {
        // If there's a search query, call searchCourses with the current input
        searchCourses(searchQuery);
    } else {
        // If the search query is empty, call explore to get all courses
        explore();
    }
}

// Initial call to load courses
explore();





function handleCourseClick(element) {
	debugger;
    var courseId = element;
    localStorage.setItem('courseId', courseId);
    window.location.href = 'course_detail_view.html';
}


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
















async function fetchCoursesByCategory(departmentName) {
    const url = `https://localhost:7246/api/Courses/GetCoursesByDepartment?department=${encodeURIComponent(departmentName)}`; // Updated URL to match your API

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json(); // Parse the JSON response
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            container.innerHTML = '<p>No courses found for this department.</p>'; // Display a message if no courses found
            return;
        }

        // Display the fetched courses
        results.forEach(element => {
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
                            <div class="prce142">$${element.price}</div>
                            <button class="shrt-cart-btn" title="cart">
                                <i class="uil uil-shopping-cart-alt" onclick="saveInLocalStorage(${element.courseId})"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
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




