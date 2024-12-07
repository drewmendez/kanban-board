# Kanban Board

A full-stack Kanban Board application built with React on the front end and Express with MySQL on the back end. This project includes user authentication and drag-and-drop functionality for easy task management.

## Features

- User Authentication: Secure login and signup system to ensure only authorized users can access their boards.
- Drag and Drop: Intuitive drag-and-drop interface to move tasks across columns.
- Task Management: Create, update, and delete tasks organized by columns (To Do, In Progress, Completed).

## Screenshots

### Demo

![Kanban Board Demo](/screenshots/demo.gif)

### ER Diagram

![ER Diagram](/screenshots/EERD.png)

## Tech Stack

- Frontend: React, Tailwind CSS, and dnd-kit for drag-and-drop support
- Backend: Express, MySQL, JWT for authentication

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/drewmendez/kanban-board-webapp.git
   cd kanban-board-webapp
   ```

2. **Install dependencies for frontend:**

   ```bash
   cd client
   npm install
   ```

3. **Install dependencies for backend backend:**

   ```bash
   cd ../server
   npm install
   ```

4. **Setup database:**

   - Create a MySQL database.
   - Run the provided SQL script located at `server/schema/dbSchema.sql` to set up the database tables.

5. **Configure environment variables:**

   - In the `server` folder, create a `.env` file with the following:

     ```env
     PORT=8080

     MYSQL_HOST=localhost
     MYSQL_USER=root
     MYSQL_PASSWORD=yourpassword
     MYSQL_DB=yourdbname

     JWT_SECRET_KEY=yoursecretkey
     ```

6. **Start the backend server:**

   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend server:**

   ```bash
   cd client
   npm run dev
   ```
