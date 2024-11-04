$('#add-course-tab').steps({
    onFinish: function () {
        create_course();
    }
});

async function create_course() {
    var url = `https://localhost:7246/api/Courses/createCourse`; // Correct endpoint

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
            SectionTitle: section.querySelector('input[name="sectionName[]"]').value, // Ensure correct input names
            VimeoLink: section.querySelector('input[name="sectionLink[]"]').value,
        };
    });

    // Create a form data object to handle the image upload
    var formData = new FormData();

    // Append simple data fields
    formData.append('courseName', courseName);
    formData.append('courseTitle', courseTitle);
    formData.append('courseDescription', courseDescription);
    formData.append('debartment', selectedDepartment);
    formData.append('price', price);

    // Append sections data as a JSON string
    formData.append('sections', JSON.stringify(sections)); // Serialize sections to JSON string

    // Append image if it exists
    if (imageFile) {
        formData.append('image', imageFile);
    }


        var response = await fetch(url, {
            method: "POST",
            body: formData, // Use formData to send the image + JSON
        });

        if (response.ok) {
            alert('Course created successfully');
            var result = await response.json();
            window.location.href = "Create_new_course.html";
        } else {
            // Improved error handling for better debugging
            try {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'Creation failed'));
                console.error('Error details:', errorData);
            } catch (jsonError) {
                alert('Error: Creation failed. Could not parse server error response.');
                console.error('JSON parsing error:', jsonError);
            }
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
