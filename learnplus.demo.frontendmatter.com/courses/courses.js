async function explore() {

debugger;
    var url=`https://localhost:7246/api/Courses/getallcourses`;

   var response= await fetch(url);
   var result = await response.json();

   var container = document.getElementById("container");



   result.forEach(element => {
    container.innerHTML += `
        <div class="card">
            <div class="card-header text-center">
                <h4 class="card-title mb-0"><a href="../student-take-course.html">${element.courseTitle ? element.courseTitle : "No Title"}</a></h4>
            </div>
            <a href="../student-take-course.html">
                <img src="https://www.shutterstock.com/image-photo/elearning-education-internet-lessons-online-600nw-2158034833.jpg"
                     alt="${element.courseName ? element.courseName : 'Course Image'}"
                     style="width:100%;">
            </a>
            <div class="card-body">
                <small class="text-muted">${element.courseAuthor ? element.courseAuthor.toUpperCase() : "UNKNOWN AUTHOR"}</small><br>
                ${element.courseDescription ? element.courseDescription.substring(0, 100) + "..." : "No description available."}<br>
                <span class="badge badge-primary ">${element.department ? element.department.toUpperCase() : "UNKNOWN DEPARTMENT"}</span>
            </div>
        </div>
    `;
});



}




explore();

