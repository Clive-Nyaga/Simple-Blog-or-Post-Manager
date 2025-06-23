// API base URL for JSON server
const BASE_URL = 'http://localhost:3000';
// Global variables to store posts and the currently selected post
let posts = [];
let currentPost = null;

// Fetch and display all posts from the API
function displayPosts() {
    fetch(`${BASE_URL}/posts`)
        .then(response => response.json())
        .then(data => {
            posts = data;
            const postList = document.getElementById('post-list');
            postList.innerHTML = '<h3>All Posts</h3>';
            
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.className = 'post-item';
                postItem.innerHTML = `
                    <img src="${post.image}" alt="${post.title}">
                    <h4>${post.title}</h4>
                `;
                postItem.addEventListener('click', () => handlePostClick(post.id));
                postList.appendChild(postItem);
            });
        });
}

// Handle post selection and display details
function handlePostClick(postId) {
    currentPost = posts.find(p => p.id === postId);
    if (currentPost) {
        displayPostDetail(currentPost);
        document.getElementById('edit-post-form').classList.add('hidden');
    }
}

// Display selected post details along with edit/delete buttons
function displayPostDetail(post) {
    const postDetail = document.getElementById('post-detail');
    postDetail.innerHTML = `
        <h3>Post Details</h3>
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="${post.title}">
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
    `;
    
    // Add event listeners to edit and delete buttons
    document.getElementById('edit-btn').addEventListener('click', showEditForm);
    document.getElementById('delete-btn').addEventListener('click', deletePost);
}

// Show edit form with current post data
function showEditForm() {
    document.getElementById('edit-title').value = currentPost.title;
    document.getElementById('edit-content').value = currentPost.content;
    document.getElementById('edit-post-form').classList.remove('hidden');
}

// Delete the entire post (including from db.json)
function deletePost() {
    if (!currentPost) {
        console.error("No post selected for deletion.");
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the post titled "${currentPost.title}"?`);

    if (confirmDelete) {
        fetch(`${BASE_URL}/posts/${currentPost.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            // Remove the post from the local array
            posts = posts.filter(post => post.id !== currentPost.id);

            // Refresh the list and clear the detail section
            displayPosts();
            document.getElementById('post-detail').innerHTML = `
                <h3>Post Details</h3>
                <p>Click on a post to view details</p>
            `;
            document.getElementById('edit-post-form').classList.add('hidden');

            // Reset the currentPost
            currentPost = null;
        })
        .catch(error => console.error('Error deleting post:', error));
    }
}

// Handle new post form submission
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;
        const imageFile = document.getElementById('image').files[0];
        
        if (imageFile) {
            if (imageFile.size > 2 * 1024 * 1024) { // 2MB limit
                alert('Image size must be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                const newPost = {
                    title,
                    content,
                    author,
                    image: e.target.result
                };
                
                fetch(`${BASE_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPost)
                })
                .then(response => response.json())
                .then(() => {
                    form.reset();
                    displayPosts();
                })
                .catch(error => console.error('Error adding post:', error));
            };
            reader.readAsDataURL(imageFile);
        } else {
            const newPost = {
                title,
                content,
                author,
                image: 'https://via.placeholder.com/300x200?text=New+Post'
            };
            
            fetch(`${BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            })
            .then(response => response.json())
            .then(() => {
                form.reset();
                displayPosts();
            })
            .catch(error => console.error('Error adding post:', error));
        }
    });
}

// Setup edit form functionality
function setupEditForm() {
    const editForm = document.getElementById('edit-post-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTitle = document.getElementById('edit-title').value;
        const newContent = document.getElementById('edit-content').value;
        
        currentPost.title = newTitle;
        currentPost.content = newContent;
        
        displayPostDetail(currentPost);

        // Update db.json (PATCH request)
        fetch(`${BASE_URL}/posts/${currentPost.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })
        })
        .then(() => displayPosts())
        .catch(error => console.error('Error updating post:', error));

        editForm.classList.add('hidden');
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        editForm.classList.add('hidden');
    });
}

// Initialize application
function main() {
    displayPosts();
    addNewPostListener();
    setupEditForm();
}

// Start application when DOM is loaded
document.addEventListener('DOMContentLoaded', main);
