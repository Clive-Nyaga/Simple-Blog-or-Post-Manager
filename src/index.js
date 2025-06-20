const BASE_URL = 'http://localhost:3000';

function displayPosts() {
    fetch(`${BASE_URL}/posts`)
        .then(response => response.json())
        .then(posts => {
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

function handlePostClick(postId) {
    fetch(`${BASE_URL}/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            postDetail.innerHTML = `
                <h3>Post Details</h3>
                <h2>${post.title}</h2>
                <img src="${post.image}" alt="${post.title}">
                <p><strong>Author:</strong> ${post.author}</p>
                <p>${post.content}</p>
            `;
        });
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

function main() {
    displayPosts();
    addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);