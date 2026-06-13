
const cl = console.log
const spinner = document.getElementById('spinner')

const BASE_URL = `https://jsonplaceholder.typicode.com`
const POST_URL = `${BASE_URL}/posts`

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')


function snackbar (msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}



function createPostCards(arr){ 
	const postContainer = document.getElementById('postContainer') 
	let result = '';
	 arr.forEach(post => {
		 result += `
		 <div class="col-md-6 mb-3" id ='${post.id}'> 
                <div class="card h-100 ">
                    <div class="card-header">
                        <h3>${post.title}</h3> <!--Post ka Title -->
                    </div>
                    <div class="card-body">
                        <p>
                           ${post.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick = "onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
                        <button onclick = "onRemove(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>
            </div>
		 ` 
	 });
	 postContainer.innerHTML = result; 	
}

function fetchPosts(){
	spinner.classList.remove('d-none');
	let xhr = new XMLHttpRequest() 
	  xhr.open('GET', POST_URL, true)
	  xhr.send(null) 
	  xhr.onload = function(){
	      // cl(xhr.response) 

		if(xhr.status >=200 && xhr.status <= 299){
              let data = JSON.parse(xhr.response)
             //  cl(data);	  
			   createPostCards(data.reverse());      
		}else{
			snackbar('Something went wrong', 'error')
		}	
         spinner.classList.add('d-none')
	}	
   
}
fetchPosts()
 
 
 function onPostSubmit(eve){
	 eve.preventDefault(); 
	 
	      let POST_OBJ = {
                  title: titleControl.value, // control data add karna hai
                  body: bodyControl.value,
                  userId: userIdControl.value
         }
         //  cl(POST_OBJ)  

	     let xhr = new XMLHttpRequest() 
		    xhr.open('POST', POST_URL) 
	        xhr.send(JSON.stringify(POST_OBJ)) 
	        xhr.onload = function(){
			    if(xhr.status >= 200 && xhr.status <= 299){
				   let res = JSON.parse(xhr.response)
				     // cl(res);
					postForm.reset()
	
			       let col = document.createElement('div')
				        col.className = 'col-md-6 mb-3'
				        col.id = res.id  
				        col.innerHTML =
				            `<div class="card h-100 ">
                                <div class="card-header">
                                   <h3>${POST_OBJ.title}</h3> 
                                </div>
                                <div class="card-body">
                                   <p> ${POST_OBJ.body}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                   <button onclick = "onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
                                  <button onclick = "onRemove(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                                </div>
                             </div>`
							 
	     const postContainer = document.getElementById('postContainer')
			  postContainer.prepend(col)
			 }else{
				snackbar('Something went wrong', 'error')
			 }
		 } 
 }
 
 function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-3').id
	 localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`

    let xhr = new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
     xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
           let res = JSON.parse(xhr.response)
            
            titleControl.value = res.title
            bodyControl.value = res.body
            userIdControl.value = res.userId

            addPostBtn.classList.add('d-none')
            updatePostBtn.classList.remove('d-none')
        }
    }
}
  
 function onPostUpdate() {
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
	    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`
    
        let UPDATE_OBJ = { 
              title: titleControl.value,
              body: bodyControl.value,
              userId: userIdControl.value,
		      id : UPDATE_ID
        }
     // cl(UPDATE_OBJ)

    spinner.classList.remove('d-none')

      let xhr = new XMLHttpRequest()
        spinner.classList.remove('d-none')
        xhr.open('PATCH', UPDATE_URL) 
        xhr.send(JSON.stringify(UPDATE_OBJ)) 
        xhr.onload = function (){
              if (xhr.status >= 200 && xhr.status <= 299) {
                let res = JSON.parse(xhr.response) // yaha pe hum practise keliye API call ker rahe hai.
			    let col = document.getElementById(UPDATE_ID)
                let h3 = col.querySelector('.card-header h3') 
		           h3.innerText = UPDATE_OBJ.title
                let p = col.querySelector('.card-body p')  
                    p.innerText = UPDATE_OBJ.body
		
			   updatePostBtn.classList.add('d-none')
			   addPostBtn.classList.remove('d-none')
                postForm.reset()

              snackbar('Post updated successfully !!!', 'success')

             } else {
            
                snackbar('Something went wrong', 'error')
        }
		    spinner.classList.add('d-none')
    }
}

 function onRemove(ele) {
    let REMOVE_ID = ele.closest('.col-md-3').id

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'Cancel'
    }).then(result => {

        if (result.isConfirmed) {
            spinner.classList.remove('d-none')
            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}` 

            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', REMOVE_URL) 
            xhr.send()

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
				   ele.closest('.col-md-3').remove()
                    snackbar('Post removed successfully !!!', 'success')
					
                } else {
                    snackbar('Something went wrong', 'error')
                }
				 spinner.classList.add('d-none')
            }

            xhr.onerror = function () {
                spinner.classList.add('d-none')
                snackbar('Something went wrong', 'error')
            }
        }
    })
}
 
postForm.addEventListener('submit', onPostSubmit)
updatePostBtn.addEventListener('click', onPostUpdate) 

