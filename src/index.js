const BASE_URL = 'http://localhost:3000';
let posts = [];
let currentPost = null;

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
            
            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            }
        });
}

function handlePostClick(postId) {
    currentPost = posts.find(p => p.id == postId);
    if (currentPost) {
        displayPostDetail(currentPost);
        document.getElementById('edit-post-form').classList.add('hidden');
    }
}

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
    
    document.getElementById('edit-btn').addEventListener('click', showEditForm);
    document.getElementById('delete-btn').addEventListener('click', deletePost);
}

function showEditForm() {
    document.getElementById('edit-title').value = currentPost.title;
    document.getElementById('edit-content').value = currentPost.content;
    document.getElementById('edit-post-form').classList.remove('hidden');
}

function deletePost() {
    posts = posts.filter(p => p.id !== currentPost.id);
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach((item, index) => {
        if (posts[index] && posts[index].id === currentPost.id) {
            item.remove();
        }
    });
    
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
    
    document.getElementById('post-detail').innerHTML = '<h3>Post Details</h3><p>Select a post to view details</p>';
    document.getElementById('edit-post-form').classList.add('hidden');
}

function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;
        const imageFile = document.getElementById('image').files[0];
        
        if (imageFile) {
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

function setupEditForm() {
    const editForm = document.getElementById('edit-post-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTitle = document.getElementById('edit-title').value;
        const newContent = document.getElementById('edit-content').value;
        
        currentPost.title = newTitle;
        currentPost.content = newContent;
        
        displayPostDetail(currentPost);
        
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
        
        editForm.classList.add('hidden');
    });
    
    document.getElementById('cancel-edit').addEventListener('click', () => {
        editForm.classList.add('hidden');
    });
}

function main() {
    displayPosts();
    addNewPostListener();
    setupEditForm();
}

document.addEventListener('DOMContentLoaded', main);