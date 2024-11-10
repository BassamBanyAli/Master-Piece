$('#add-course-tab').steps({
    onFinish: function () {
        create_course();
    }
});

async function create_course() {
    var url = `https://localhost:7246/api/Courses/createCourse`;

    // Get form field values
    var courseName = document.getElementById('courseName').value;
    var courseTitle = document.getElementById('courseTitle').value;
    var courseDescription = document.getElementById('courseDescription').value;
    var selectedDepartment = document.getElementById('selectcategory').value;
    var price = parseFloat(document.getElementById('price').value);

    // Get the thumbnail image file
    var thumbnailInput = document.getElementById('ThumbFile__input--source');
    var imageFile = thumbnailInput.files.length > 0 ? thumbnailInput.files[0] : null;

    // Retrieve sections from the DOM
    var sections = Array.from(document.querySelectorAll('.section')).map(section => {
        return {
            SectionTitle: section.querySelector('input[name="sectionName[]"]').value,
            VimeoLink: section.querySelector('input[name="sectionLink[]"]').value,
        };
    });

    var instructorId = localStorage.getItem("instructorId");

    // Create a form data object to handle the image upload
    var formData = new FormData();
    formData.append('courseName', courseName);
    formData.append("InstructorId", instructorId);
    formData.append('courseTitle', courseTitle);
    formData.append('courseDescription', courseDescription);
    formData.append('debartment', selectedDepartment);
    formData.append('price', price);
    formData.append('sections', JSON.stringify(sections));

    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        
            // Store the course data in localStorage
            const newCourseData = {
                courseId: result.courseId || result.CourseId, // Use alternative names if necessary
                image: result.image || result.Image,
                description: result.description || result.CourseDescription,
                name: result.name || result.CourseName,
                title: result.title || result.CourseTitle,
                price: result.price || result.Price
            };
            
        
            let newCourseDataArray = JSON.parse(localStorage.getItem("newCourseDataArray")) || [];
            const courseExists = newCourseDataArray.some(course => course.courseId === newCourseData.courseId);
        
            if (!courseExists) {
                newCourseDataArray.push(newCourseData);
                localStorage.setItem("newCourseDataArray", JSON.stringify(newCourseDataArray));
            }
        
            alert('Course created successfully');
            window.location.href = "Create_new_course.html";
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Creation failed'));
            console.error('Error details:', errorData);
        }
    } catch (error) {
        alert('An error occurred while creating the course.');
        console.error('Request error:', error);
    }
}


// Function to add a new section
function addSection() {
    const sectionTemplate = document.getElementById('section-template').innerHTML;
    const sectionsContainer = document.querySelector('.sections-container');
    sectionsContainer.insertAdjacentHTML('beforeend', sectionTemplate);
}

// Handle thumbnail image preview
document.getElementById('ThumbFile__input--source').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const imgElement = document.querySelector('.thumb-item img');

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            imgElement.src = e.target.result; // Update the thumbnail image source
        };

        reader.readAsDataURL(file); // Convert the image file to base64
    }
});

























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

async function signOut() {
    debugger;
    localStorage.removeItem("instructorId");
    window.location.href="Login/sign_in.html"
    
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
    let newCourseDataArray = JSON.parse(localStorage.getItem("newCourseDataArray")) || [];

    // Check if the course with the same courseId already exists
    const courseExists = newCourseDataArray.some(course => course.courseId === courseId);

    // If course doesn't exist, add it to the array and save back to localStorage
    if (!courseExists) {
        newCourseDataArray.push(newCourseData);
        localStorage.setItem("newCourseDataArray", JSON.stringify(newCourseDataArray));
    }
}


