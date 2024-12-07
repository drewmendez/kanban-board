# Kanban Board

A full-stack Kanban Board application built with React on the front end and Express with MySQL on the back end. This project includes user authentication and drag-and-drop functionality for easy task management.

## Features

- User Authentication: Secure login and signup system to ensure only authorized users can access their boards.
- Drag and Drop: Intuitive drag-and-drop interface to move tasks across columns.
- Task Management: Create, update, and delete tasks organized by customizable columns (e.g., To Do, In Progress, Done).
- Backend with Express and MySQL: An Express.js server with a MySQL database to handle user data and tasks, providing a robust back end for data storage and retrieval.

## Tech Stack

- Frontend: React, Tailwind CSS, and dnd-kit for drag-and-drop support
- Backend: Express, MySQL, JWT for authentication

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/drewmendez/kanban-board-webapp.git
   cd kanban-board-webapp
   ```

2. Set up the frontend:

   - Navigate to the client folder and install dependencies:

     ```bash
     cd client
     npm install
     ```

   - Run the client:

     ```bash
     npm run dev
     ```

3. Set up the backend:

   - Go to the server directory and install dependencies, configure your MySQL database and environment variables for database connections and JWT secrets.

     ```bash
     cd server
     npm install
     ```

   - Run the server:

     ```bash
     npm run dev
     ```
