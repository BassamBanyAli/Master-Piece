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
                                <i class="uil uil-shopping-cart-alt" onclick="saveInLocalStorage(${element.courseId}, '${element.courseName}', '${element.department}', '${element.price}', '${element.image}')"></i>
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


async function saveInLocalStorage(courseId, name, department, price, image) {
    debugger;
    // Get the content or values of the elements



    // Create a new course object
    const newCourseData = {
        courseId,
        image,
        name,
        department,
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














async function getProfile() {
   var id = localStorage.getItem("id");
   if(id!==null){
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
}

getProfile();

