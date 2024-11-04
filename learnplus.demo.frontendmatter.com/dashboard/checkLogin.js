async function isLogin() {

var islogin=localStorage.getItem("userIdAdmin");
    if(islogin===null)
    {
        window.location.href="../Login/guest-login.html"
    }
    
}
isLogin();




async function logout() {

    localStorage.removeItem("userIdAdmin");
    window.location.reload(); 
}
async function recentStudents() {
    try {
        const url = `https://localhost:7246/api/Students/AllStudents`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch students. Status: ${response.status}`);
        }
        
        const result = await response.json();

        // Get the current date and calculate one week ago
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 30);

        // Filter students based on enrolledDate (within the last week)
        const recentStudents = result.filter(student => {
            const enrolledDate = student.enrolledDate ? new Date(student.enrolledDate) : null;
            return enrolledDate && enrolledDate >= oneWeekAgo && enrolledDate <= today;
        });

        // Clear previous content in the container
        const container = document.getElementById("container");
        if (!container) {
            console.error('Container element not found');
            return;
        }
        container.innerHTML = '';
console.log(recentStudents);
        // Append recent students to the container
        recentStudents.forEach(element => {
            container.innerHTML += `
                <li class="list-group-item"
                    style="z-index: initial;">
                    <div class="d-flex align-items-center">
                        <a href="../student-take-course.html"
                           class="avatar avatar-4by3 avatar-sm mr-3">
                            <img src="https://helios-i.mashable.com/imagery/articles/048mVbxX22nwtgkc3pUpE80/hero-image.fill.size_1248x702.v1630937109.jpg"
                                 alt="course"
                                 class="avatar-img rounded">
                        </a>
                        <div class="flex">
                            <a href="../student-take-course.html"
                               class="text-body"><strong>${element.fullName}</strong></a>
                            <div class="d-flex align-items-center">
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });
    } catch (error) {
        console.error('Error fetching recent students:', error);
    }
}

// Call the function to get recent students on page load
recentStudents();






async function recentCourses() {
    debugger;
    try {
        const url = `https://localhost:7246/api/Courses/getallcourses`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch students. Status: ${response.status}`);
        }
        
        const result = await response.json();

        // Get the current date and calculate one week ago
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 14);

        // Filter students based on enrolledDate (within the last week)
        const recentCourses = result.filter(course => {
            const enrolledDate = course.createdAt ? new Date(course.createdAt) : null;
            return enrolledDate && enrolledDate >= oneWeekAgo && enrolledDate <= today;
        });

        // Clear previous content in the container
        const container = document.getElementById("container2");
        if (!container) {
            console.error('Container element not found');
            return;
        }
        container.innerHTML = '';
console.log(recentCourses);
        // Append recent students to the container
        recentCourses.forEach(element => {
            container.innerHTML += `
                <li class="list-group-item"
                    style="z-index: initial;">
                    <div class="d-flex align-items-center">
                        <a href="../student-take-course.html"
                           class="avatar avatar-4by3 avatar-sm mr-3">
                            <img src="https://happyaddons.com/wp-content/uploads/2020/06/How-to-Create-Set-up-Launch-an-Online-Course-Website-1024x640.png"
                                 alt="course"
                                 class="avatar-img rounded">
                        </a>
                        <div class="flex">
                            <a href="../student-take-course.html"
                               class="text-body"><strong>${element.courseName}</strong></a>
                            <div class="d-flex align-items-center">
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });
    } catch (error) {
        console.error('Error fetching recent students:', error);
    }
}

// Call the function to get recent students on page load
recentCourses();




async function recentInstructors() {
    debugger;
    try {
        const url = `https://localhost:7246/api/Instructors/AllInstructors`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch students. Status: ${response.status}`);
        }
        
        const result = await response.json();

        // Get the current date and calculate one week ago
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 14);

        // Filter students based on enrolledDate (within the last week)
        const recentCourses = result.filter(course => {
            const enrolledDate = course.createdAt ? new Date(course.createdAt) : null;
            return enrolledDate && enrolledDate >= oneWeekAgo && enrolledDate <= today;
        });

        // Clear previous content in the container
        const container = document.getElementById("container3");
        if (!container) {
            console.error('Container element not found');
            return;
        }
        container.innerHTML = '';
console.log(recentCourses);
        // Append recent students to the container
        recentCourses.forEach(element => {
            container.innerHTML += `
                <li class="list-group-item"
                    style="z-index: initial;">
                    <div class="d-flex align-items-center">
                        <a href="../student-take-course.html"
                           class="avatar avatar-4by3 avatar-sm mr-3">
                            <img src="https://www.caredocs.co.uk/wp-content/uploads/2021/03/CareDocs-Online-Training-1024x586.png"
                                 alt="course"
                                 class="avatar-img rounded">
                        </a>
                        <div class="flex">
                            <a href="../student-take-course.html"
                               class="text-body"><strong>${element.fullName}</strong></a>
                            <div class="d-flex align-items-center">
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });
    } catch (error) {
        console.error('Error fetching recent students:', error);
    }
}

// Call the function to get recent students on page load
recentInstructors();

