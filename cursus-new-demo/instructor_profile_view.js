async function getProfile() {
    debugger;
    var id = localStorage.getItem("instructorId");
    var url = `https://localhost:7246/api/Instructors/getSpeceficInstructor?id=${id}`;

    try {
        var response = await fetch(url, {
            method: "GET"
        });

        if (response.ok) {
            var result = await response.json();

            // Display the instructor's information
            document.getElementById("name").textContent = result.fullName;
            document.getElementById("image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementById("Department").textContent = result.department;
            document.getElementById("about").textContent = result.about;

            // Get the email from the result
            var email = result.email; // Make sure this matches your API response property name

            // Create a button that uses mailto
            var messageButton = document.createElement("button");
            messageButton.className = "subscribe-btn btn500";
            messageButton.textContent = "Send message";
            messageButton.onclick = function () {
                window.location.href = `mailto:${email}?subject=Message&body=Your message here.`;
            };

            // Append the button to a specific container (change the selector as needed)
            document.getElementById("messageButtonContainer").appendChild(messageButton);

        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Failed to load profile.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the profile. Please try again.');
    }
}

// Call the function to get the profile
getProfile();





async function courses() {
    debugger;
    var id=localStorage.getItem("instructorId");
    var url = `https://localhost:7246/api/Instructors/coursesPublishByInstructor?id=${id}`;
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
