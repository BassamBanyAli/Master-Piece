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
        const price = document.getElementById("coursePrice");
        const date = document.getElementById("date");
        const videoPlayer = document.getElementById("videoPlayer");
        const image = document.getElementById("image");


localStorage.setItem("instructorId",result.instructorId);
        var messageButton = document.createElement("button");
        messageButton.className = "subscribe-btn btn500";
        messageButton.textContent = "View Instructor Profile";
        messageButton.onclick = function () {
            window.location.href = "../instructor_profile_view.html";
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
        price.innerHTML = "Price is $" + result.price || 'No price available';
        date.innerHTML = formattedDate; // Display formatted date
        videoPlayer.src = result.tutorialVideo;
        image.src = `https://localhost:7246/uploads/${result.image}`; // Use result.image
        localStorage.setItem("image", result.image);

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
    try {
        const courseId = localStorage.getItem("courseId");
        const url = `https://localhost:7246/api/Cources/getSections?id=${courseId}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const container = document.getElementById("accordion");
        container.innerHTML = "";

        result.$values.forEach(section => {
            const numberOfTopics = section.topics.$values.length;

            let sectionHtml = `
                <div class="accordion-section">
                    <a href="javascript:void(0)" class="accordion-header">
                        <div class="section-header-left">
                            <span class="section-title-wrapper">
                                <i class='uil uil-presentation-play crse_icon'></i>
                                <span class="section-title-text">${section.sectionTitle}</span>
                            </span>
                        </div>
                        <div class="section-header-right">
                            <span class="num-items-in-section">${numberOfTopics} ${numberOfTopics === 1 ? 'lecture' : 'lectures'}</span>
                            <span class="section-header-length">--:--</span>
                        </div>
                    </a>
                    <div class="accordion-content">
            `;

            section.topics.$values.forEach(topic => {
                sectionHtml += `
                    <div class="lecture-container">
                        <div class="left-content">
                            <i class='uil uil-file icon_142'></i>
                            <div class="title">${topic.topicTitle}</div>
                        </div>
                        <div class="details">
                            <a href="javascript:void(0)" class="preview-text" data-vimeo-link="${topic.vimeoLink}">Preview</a>
                            <span class="content-summary">--:--</span>
                        </div>
                    </div>
                `;
            });

            sectionHtml += `</div></div>`;
            container.innerHTML += sectionHtml;
        });

        attachAccordionEventListeners();

        // Attach click events for the preview links
        attachPreviewLinkListeners();

    } catch (error) {
        console.error('Error fetching course details:', error);
    }
}

function attachAccordionEventListeners() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isExpanded = content.style.display === "block";

            document.querySelectorAll('.accordion-content').forEach(item => {
                item.style.display = 'none';
            });

            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}

// Attach event listeners for preview links
function attachPreviewLinkListeners() {
    const previewLinks = document.querySelectorAll('.preview-text');

    previewLinks.forEach(link => {
        link.addEventListener('click', function () {
            const vimeoLink = this.getAttribute('data-vimeo-link');
            const iframe = document.getElementById('videoPlayer');
            iframe.src = vimeoLink; // Change the iframe source to the selected video link

            // Show the modal
            const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
            videoModal.show();
        });
    });
}

// Call the function to load content when the page loads
getContent();









async function checkAndSwitchTab() {
    debugger;
    var isLogin = localStorage.getItem("id");
    
    if (isLogin === null) {
        // Redirect to the login page if not logged in
        window.location.href = "../Login/sign_in.html";
    } else {
        // If logged in, activate the Courses Content tab
        const tab = new bootstrap.Tab(document.getElementById("nav-courses-tab"));
        tab.show(); // Activate the tab
    }
}



async function content() {

    var id=localStorage.getItem("id");

    if(id===null){

        window.location.href="../Login/sing_in.html";
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