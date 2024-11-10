async function myCourses() {
debugger;
var id=localStorage.getItem("id");
    var url=`https://localhost:7246/api/Courses/getCoursesPaid?id=${id}`;

   var response= await fetch(url);
   var result = await response.json();
   console.log(result);

   var container = document.getElementById("container");
container.innerHTML='';


   result.forEach(element => {

       container.innerHTML += `	<div class="col-lg-3 col-md-4">
                                   <div class="fcrse_1 mt-30">
                                       <a href="../mycourse/index.html" class="fcrse_img" onclick="handleCourseClick(${element.courseId})">
                                           <img src="https://localhost:7246/uploads/${element.image}" alt="">
                                           <div class="course-overlay">
                                               <span class="play_btn1"><i class="uil uil-play"></i></span>

                                           </div>
                                       </a>
                                       <div class="fcrse_content">

                                           <a href="../mycourse/index.html" class="crse14s" onclick="handleCourseClick(${element.courseId})">${element.courseName}</a>
                                           <a href="../mycourse/index.html" class="crse-cate" onclick="handleCourseClick(${element.courseId})">${element.department}</a>
                                           <div class="auth1lnkprce">
                                               <p class="cr1fot">By <a href="#">${element.courseAuthor}</a></p>
                                               
                                       </div>
                                   </div>													
                               </div>
                               `;
   });


}




function handleCourseClick(courseId) {
   // Store the courseId in localStorage
   localStorage.setItem('courseId', courseId);

   // Redirect to the course details page
   window.location.href = `course_detail_view.html?courseId=${courseId}`;
}
myCourses();





async function getProfile() {
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

