# Blog Post Manager

A simple web application for managing blog posts with full CRUD (Create, Read, Update, Delete) functionality. Built with JavaScript and uses JSON Server for data persistence.

## Features

- **Create Posts**: Add new blog posts with title, content, author, and optional image upload
- **View Posts**: Browse all posts in a sidebar and view detailed information
- **Edit Posts**: Update existing post titles and content
- **Delete Posts**: Remove posts from the database with confirmation
- **Image Support**: Upload images or use placeholder images
- **Auto-selection**: First post is automatically displayed when the page loads
- **Responsive Design**: Clean, modern interface that works on different screen sizes

## Project Structure

```
Simple-Blog-or-Post-Manager/
├── index.html          # Main HTML file
├── index.js           # JavaScript functionality
├── styles.css         # CSS styling
├── db.json           # JSON Server database
└── README.md         # Project documentation
```

## Prerequisites

- Node.js installed on your system
- JSON Server package

## Installation

1. Clone or download the project
2. Install JSON Server globally:
   ```bash
   npm install -g json-server
   ```

## Usage

1. Start the JSON Server:
   ```bash
   json-server --watch db.json --port 3000
   ```

2. Open `index.html` in your web browser

3. The application will automatically load and display existing posts

## How to Use

### Adding a New Post
1. Fill in the "Add New Post" form on the left panel
2. All fields (Title, Content, Author) are required
3. Optionally upload an image file
4. Click "Add Post" to save

### Viewing Posts
- All posts appear in the left sidebar
- Click on any post to view its details in the right panel
- The first post is automatically selected when the page loads

### Editing Posts
1. Select a post to view its details
2. Click the "Edit" button
3. Modify the title and/or content in the edit form
4. Click "Update Post" to save changes or "Cancel" to discard

### Deleting Posts
1. Select a post to view its details
2. Click the "Delete" button
3. Confirm the deletion in the popup dialog

## Technical Details

- **Frontend**: HTML, CSS, and JavaScript
- **Backend**: JSON Server for REST API
- **Data Storage**: JSON file (db.json)
- **Image Handling**: Base64 encoding for uploaded images
- **API Endpoints**:
  - GET `/posts` - Retrieve all posts
  - POST `/posts` - Create new post
  - PATCH `/posts/:id` - Update existing post
  - DELETE `/posts/:id` - Delete post

## API Base URL

The application connects to JSON Server running on `http://localhost:3000`

## Browser Compatibility

Works with all modern web browsers that support:
- ES6 JavaScript features
- Fetch API
- FileReader API
- FormData handling

## Future Features

- **Search Functionality**: Search posts by title, content, or author
- **Categories/Tags**: Organize posts with categories and tags
- **User Authentication**: Login system for multiple users
- **Rich Text Editor**: WYSIWYG editor for post content
- **Image Gallery**: Better image management and gallery view
- **Export/Import**: Export posts to various formats (PDF, Word, etc.)
- **Comments System**: Allow comments on posts
- **Post Scheduling**: Schedule posts for future publication
- **Dark Mode**: Toggle between light and dark themes
- **Pagination**: Handle large numbers of posts efficiently
- **Backup/Restore**: Backup and restore functionality for data
- **Mobile App**: Native mobile application version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation as needed
- Keep commits focused and descriptive

---

© 2025 Clive Nyaga Kagotho. All rights reserved.
