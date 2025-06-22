// API base URL for JSON server
const BASE_URL = 'http://localhost:3000';
// Global variables to store posts and current selected post
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
            
            // Create post items for each post
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
            
            // Auto-select first post on page load
            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            }
        });
}

// Handle post selection and display details
function handlePostClick(postId) {
    currentPost = posts.find(p => p.id == postId);
    if (currentPost) {
        displayPostDetail(currentPost);
        document.getElementById('edit-post-form').classList.add('hidden');
    }
}

// Display selected post details with edit/delete buttons
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

// Delete post from frontend (no backend persistence)
function deletePost() {
    posts = posts.filter(p => p.id !== currentPost.id);
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach((item, index) => {
        if (posts[index] && posts[index].id === currentPost.id) {
            item.remove();
        }
    });
    
    // Refresh post list display
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
    
    // Clear post detail view
    document.getElementById('post-detail').innerHTML = '<h3>Post Details</h3><p>Select a post to view details</p>';
    document.getElementById('edit-post-form').classList.add('hidden');
}

// Handle new post form submission
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;
        const imageFile = document.getElementById('image').files[0];
        
        // Handle image upload with file size validation
        if (imageFile) {
            // Check file size (2MB limit for responsive design)
            if (imageFile.size > 2 * 1024 * 1024) {
                alert('Image size must be less than 2MB');
                return;
            }
            // Convert image to base64 for storage
            const reader = new FileReader();
            reader.onload = function(e) {
                const newPost = {
                    title,
                    content,
                    author,
                    image: e.target.result
                };
                
                // Save post to database
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
            // Use placeholder image if no file uploaded
            const newPost = {
                title,
                content,
                author,
                image: 'https://via.placeholder.com/300x200?text=New+Post'
            };
            
            // Save post to database
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
        
        // Get updated values from form
        const newTitle = document.getElementById('edit-title').value;
        const newContent = document.getElementById('edit-content').value;
        
        // Update current post (frontend only - no backend persistence)
        currentPost.title = newTitle;
        currentPost.content = newContent;
        
        // Refresh displays
        displayPostDetail(currentPost);
        
        // Update post list to reflect changes
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
        
        // Hide edit form
        editForm.classList.add('hidden');
    });
    
    // Cancel edit functionality
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