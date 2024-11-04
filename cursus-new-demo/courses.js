async function explore() {


    var url=`https://localhost:7246/api/Courses/getallcourses`;

   var response= await fetch(url);
   var result = await response.json();

   var container = document.getElementById("container");



   result.forEach(element => {

       container.innerHTML += `	<div class="col-lg-3 col-md-4">
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
                                           <a href="courseDetail.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                                           <div class="auth1lnkprce">
                                               <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                                               <div class="prce142">$${element.price}</div>
                                               <button class="shrt-cart-btn" title="cart"><i class="uil uil-shopping-cart-alt" onclick="saveInLocalStorage(${element.courseId})"></i></button>
                                           </div>
                                       </div>
                                   </div>													
                               </div>
                               `;
   });


}
async function saveInLocalStorage(id) {
   debugger;
   var url = `https://localhost:7246/api/Courses/getCourse?id=${id}`;

   try {
       // Fetch the course data from the API
       var response = await fetch(url);

       // Check if the response is ok (status code 200)
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }

       // Parse the JSON response
       var result = await response.json(); 

       // Extract properties from the result
       const courseId = result.courseId;   // Assuming 'courseId' is a unique identifier
       const name = result.courseName;      
       const title = result.courseTitle;
       const price = result.price; 
       const Instructor = result.courseAuthor;    

       // Create a new course object
       const newCourseData = {
           courseId: courseId, // Include the unique ID for comparison
           name: name,
           title: title,
           price: price,
           Instructor: Instructor
       };

       // Retrieve existing array from localStorage or initialize an empty array
       let courseDataArray = JSON.parse(localStorage.getItem("courseDataArray")) || [];

       // Check if the course is already in the array
       const courseExists = courseDataArray.some(course => course.courseId === courseId);

       if (!courseExists) {
           // Push the new course object into the array if it's not already there
           courseDataArray.push(newCourseData);

           // Save the updated array back to localStorage
           localStorage.setItem("courseDataArray", JSON.stringify(courseDataArray));

           console.log('Course added successfully:', newCourseData);
       } else {
           console.log('Course already exists in localStorage:', newCourseData);
       }
   } catch (error) {
       console.error('Error fetching the course:', error); // Handle any errors that occur during fetch
   }
}



function handleCourseClick(courseId) {
   // Store the courseId in localStorage
   localStorage.setItem('courseId', courseId);

   // Redirect to the course details page
   window.location.href = `beforeLogin/course_detail_view.html?courseId=${courseId}`;
}
explore();














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

