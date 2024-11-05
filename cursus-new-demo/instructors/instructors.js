async function explore() {
    debugger;
    var url = `https://localhost:7246/api/Instructors/AllInstructors`;
    var response = await fetch(url);
    var result = await response.json();

    var container = document.getElementById("container");
    container.innerHTML = ''; // Clear existing content before adding new

    result.forEach(element => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4">
                <div class="fcrse_1 mt-30" onclick="handleInstructorClick(${element.instructorId})">
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
            </div>`;
    });
}


async function searchCourses(query) {
    const url = `https://localhost:7246/api/Instructors/search?query=${encodeURIComponent(query)}`; // Build the search URL

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
                <div class="fcrse_1 mt-30" onclick="handleInstructorClick(${element.instructorId})">
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
getProfile();






function handleInstructorClick(instructorId) {
    debugger;

    const profileImage = document.getElementById("profile-image");

    if (profileImage) {
        // Store the instructor ID and navigate if profileImage exists
        localStorage.setItem('instructorId', instructorId);
        window.location.href = "../instructor_profile_viewLogin.html";
    } else {
        // Store the instructor ID and navigate if profileImage does not exist
        localStorage.setItem('instructorId', instructorId);
        window.location.href = "../instructor_profile_view.html"; // Update this URL to match your routing
    }
}









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

            // Check if elements exist before updating them
            const profileImage = document.getElementById("profile-image");
            const firstProfileImage = document.getElementById("firstProfile-image");
            const profileName = document.getElementById("profile-name");
            const profileEmail = document.getElementById("profile-email");

            if (profileImage) {
                profileImage.src = `https://localhost:7246/uploads/${result.image}`;
            }
            if (firstProfileImage) {
                firstProfileImage.src = `https://localhost:7246/uploads/${result.image}`;
            }
            if (profileName) {
                profileName.textContent = result.fullName;
            }
            if (profileEmail) {
                profileEmail.textContent = result.email;
            }

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








