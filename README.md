<h1 align="center">
    SCHOOL MANAGEMENT SYSTEM
</h1>

<h3 align="center">
Streamline school management, class organization, and add students and faculty.<br>
Seamlessly track attendance, assess performance, and provide feedback. <br>
Access records, view marks, and communicate effortlessly.
</h3>

<p>
  <a href="https://youtu.be/ol650KwQkgY?si=rKcboqSv3n-e4UbC">Youtube Video</a>
</p>

<p>
  <a href="https://www.linkedin.com/in/yogndrr/">LinkedIn</a>
</p>


# About

The School Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline school management, class organization, and facilitate communication between students, teachers, and administrators.

## Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Attendance Tracking:** Teachers can easily take attendance for their classes, mark students as present or absent, and generate attendance reports.

- **Performance Assessment:** Teachers can assess students' performance by providing marks and feedback. Students can view their marks and track their progress over time.

- **Data Visualization:** Students can visualize their performance data through interactive charts and tables, helping them understand their academic performance at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

## Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB

<br>

# Installation

Clone the project:

```
git clone https://github.com/Yogndrr/MERN-School-Management-System.git
```

There are three branches in this repository. Each serves a different purpose.

`main` contains the work that reflects my current standards. I am rebuilding the project architecture here with updated patterns, cleaner structure, and better practices than the original version.

`community-version` collects community contributions and external PRs. It stays separate from main while I rebuild the core.

`legacy-version` contains the same code shown in the YouTube tutorial. If you came from the video and want the exact version demonstrated there, switch to this branch after cloning.
Open a terminal and paste this command to switch to the `legacy-version` branch. But if you want to try the latest one then you can stay in the main branch.

```
git checkout legacy-version
```

Open two terminals.

Backend setup:

```
cd backend
npm install
```

Create a .env file in the backend folder. Add the following:

```
MONGO_URL = mongodb://127.0.0.1/smsproject

SECRET_KEY = 'secret123key'
```

Fill MONGO_URL using the instructions below. SECRET_KEY is any random string.

Start the backend:

```
npm start
```

Frontend setup:

```
cd frontend
npm install
```

Create a .env file in the frontend folder and add:

```
REACT_APP_BASE_URL=http://localhost:5000
```

If a .env file already exists and the line is commented out, remove the comment.

```
npm start
```

Frontend runs at localhost:3000. Backend runs at localhost:5000.

# MONGO_URL instructions

Use one of these two methods depending on whether you want a local development database or a cloud database.

## Option 1 — Local MongoDB

You need two components: the MongoDB server and Compass.

Install MongoDB Community Server from <a href="https://mongodb.com/try/download/community">mongodb.com/try/download/community</a>. This install includes the mongod server. Install Compass from <a href="https://mongodb.com/try/download/compass">mongodb.com/try/download/compass</a>..

Start the MongoDB service. On Windows or macOS the installer usually sets it to run automatically. If it is not running, you can start it manually:

```
mongod
```

Open Compass. Connect using:

```
mongodb://127.0.0.1:27017/yourdbname
```

Replace yourdbname with any name. Use that full connection string as your MONGO_URL.

## Option 2 — MongoDB Atlas (cloud)

Create an Atlas account at <a href="https://mongodb.com/atlas">mongodb.com/atlas</a> and create a free cluster.

In the cluster page, select:

Database → Connect → Connect your application

Atlas shows you a connection string:

```
mongodb+srv://<user>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

Replace the placeholders. Use that full string as your MONGO_URL.

Use Atlas if you plan to deploy the project.

# Branch selection

If you are learning from the YouTube video and want the same project the tutorial was based on, use legacy-version.

If you want the original project but also want to apply new changes yourself, stay on legacy-version and modify it as needed.

If you want the updated architecture, use main. This is under active development and contains major improvements.

If you want to contribute, use community-version. All external PRs land there.

# Deployment

There are multiple ways to deploy the project. Use any combination depending on how you prefer to manage the client and server.

## Deploying the backend

### Render

Render works well for Express-based APIs and requires almost no infrastructure setup.

1. Push your code to GitHub.
2. Create a new Web Service in Render.
3. Select your backend folder as the root.
4. Set the build command to:

```
npm install
```

5. Set the start command to:

```
npm start
```

6. Add the required environment variables from your .env file (MONGO_URL and SECRET_KEY).

Render automatically redeploys on every push.

## Deploying the frontend

### Netlify

Netlify builds and serves the React application.

Steps:

1. Push your frontend folder to GitHub.
2. Create a new Netlify project.
3. Set the build command:

```
npm run build
```

4. Set the publish directory:

```
build
```

5. Add an environment variable if needed for the API endpoint:

```
REACT_APP_BASE_URL=https://your-backend-url
```

Netlify auto-builds on every push.

### Vercel

Vercel deploys React-based frontends easily. Same build command. Same publish directory.

## Connecting frontend and backend

After deploying both sides, set the frontend environment variable to point to your backend URL. For example:

```
REACT_APP_BASE_URL=https://your-backend.onrender.com
```

Rebuild the frontend when deploying to Netlify or Vercel.

# Notes

The legacy-version branch remains available for anyone who needs the original two-year-old tutorial code. The main branch will continue to evolve as I rebuild the project's architecture using the practices I use today. The community-version branch is available for contributions without affecting the core redesign.
