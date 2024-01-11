const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error opening the database:', err.message);
  } else {
    console.log('Connected to the database successfully!');
  }
});

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS "user" (
        "userID" INTEGER NOT NULL UNIQUE,
        "username" CHAR UNIQUE,
        "password" CHAR,
        "email" CHAR,
        "phone" INTEGER,
        "role" INTEGER,
        PRIMARY KEY("userID" AUTOINCREMENT)
      );
    `);

  // Create education table
  db.run(`
      CREATE TABLE IF NOT EXISTS "education" (
        "educationID" INTEGER NOT NULL UNIQUE,
        "userID" INTEGER,
        "degree" CHAR,
        "school" CHAR,
        "description" TEXT,
        FOREIGN KEY("userID") REFERENCES "user"("userID"),
        PRIMARY KEY("educationID" AUTOINCREMENT)
      );
    `);

  // Create experience table
  db.run(`
      CREATE TABLE IF NOT EXISTS "experience" (
        "experienceID" INTEGER NOT NULL UNIQUE,
        "userID" INTEGER,
        "company" CHAR,
        "jobTitle" CHAR,
        "description" TEXT,
        FOREIGN KEY("userID") REFERENCES "user"("userID"),
        PRIMARY KEY("experienceID" AUTOINCREMENT)
      );
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS "projects" (
        "projectID" INTEGER NOT NULL UNIQUE,
        "userID" INTEGER,
        "projectType" TEXT,
        "projectTitle" TEXT,
        "projectDesc" TEXT,
        FOREIGN KEY("userID") REFERENCES "user"("userID"),
        PRIMARY KEY("projectID" AUTOINCREMENT)
      );
    `);

})


const dataUser = [
  {
    "email": "gama22aj@student.ju.se",
    "password": "$2b$10$a7fAx/jP4UbDCAUJF5BZl.h72kTOJrmctwjCIWMMpJwor3Tc6TT3m",
    "phone": 707070707,
    "role": 1,
    "userID": 1,
    "username": "maria11"
  },
  {
    "email": "user222@gmail.com",
    "password": "$2b$10$HpAUuMDOYKhRwFZRK5UyAeeBOZfHBNqwMfDkjBh42Kz9FoZm374R2",
    "phone": 707070707,
    "role": 0,
    "userID": 2,
    "username": "user222"
  },
  {
    "email": "user333@gmail.com",
    "password": "$2b$10$acdDBrEB8zLmezhpAAuQAeshGCmoL0BNQPAGzdAvrH.0abaufpfAe",
    "phone": 707070707,
    "role": 0,
    "userID": 3,
    "username": "user333"
  },
  {
    "email": "user123@gmail.com",
    "password": "$2b$10$6qDm9rJQbw2wkmWE/Qr1cOW4.t1mS5WaQikqRkvkXJTJPuCCgDPsa",
    "phone": 707070707,
    "role": 0,
    "userID": 4,
    "username": "user123"
  },
  {
    "email": "user0@gmail.com",
    "password": "$2b$10$kf3EzS5Ehyd8xZo.2vBE.O.KmNo1QZrhud5VCUIuxHrUkiEfbpZMy",
    "phone": 707070707,
    "role": 0,
    "userID": 5,
    "username": "user0"
  }
]
const dataEducation = [
  {
    "degree": "Degree of Bachelor in Computer Engineering specialization in Software Engineering and Mobile Platforms",
    "description": "aug 2022 - jun 2025",
    "educationID": 1,
    "school": "Jönköping University ",
    "userID": 1
  },
  {
    "degree": "Pshychology 1, basic course",
    "description": "aug 2021 - jan 2022",
    "educationID": 2,
    "school": "Linköping University",
    "userID": 1
  },
  {
    "degree": "Natural Science Program ",
    "description": "aug 2016 - jun 2019",
    "educationID": 3,
    "school": "Katedralskolan",
    "userID": 1
  }
]


const dataExperience = [
  {
    "company": "Emotion Logistics",
    "description": "Worked as a warehouse worker for Gants clothes. My main duties consisted of receiving, packing and shipping customers orders",
    "experienceID": 1,
    "jobTitle": "Warehouse worker, B2C admin",
    "userID": 1
  },
  {
    "company": "Ikea",
    "description": "Worked as a salesperson at Ikea. My main responsibilities consisted of customer service and assisting customers in discovering and acquiring home furnishing products",
    "experienceID": 2,
    "jobTitle": "Salesperson",
    "userID": 1
  },
  {
    "company": "Circle K",
    "description": "jun 2019 - aug 2022",
    "experienceID": 3,
    "jobTitle": "Salesperson",
    "userID": 1
  },
  {
    "company": "Martin och Servera",
    "description": "jan 2022 -sep 2022",
    "experienceID": 4,
    "jobTitle": "Warehouse worker",
    "userID": 1
  },
  {
    "company": "Indiska",
    "description": "okt 2021 - mars 2022",
    "experienceID": 5,
    "jobTitle": "Shop assistant",
    "userID": 1
  }
]

const dataProjects = [
  {
    "projectDesc": "The Online Banking System project is a comprehensive database-driven application designed to streamline and enhance the banking experience for both customers and administrators. This project aims to provide a secure, efficient, and user-friendly platform for various banking operations, promoting accessibility and convenience. Including SQL queries and normalization.",
    "projectID": 1,
    "projectTitle": "Online Banking Database",
    "projectType": "Database Project",
    "userID": 1
  },
  {
    "projectDesc": "Assistant project is a cutting-edge mobile application designed to revolutionize the way we shop. This innovative app is your go-to companion for a smarter and more efficient shopping experience. ShopSmart is all about making your shopping journey hassle-free, convenient, and enjoyable.",
    "projectID": 2,
    "projectTitle": "ShopSmart: Your Personal Shopping Assistant",
    "projectType": "Using object oriented fundamentals",
    "userID": 1
  },
  {
    "projectDesc": "Java-based chess game is a captivating application that leverages the principles of Object-Oriented Programming (OOP) to bring the classic game to life. With an intuitive graphical interface, players can engage in strategic battles on an 8x8 chessboard. The game employs well-defined classes for each chess piece, embracing the tenets of encapsulation, inheritance, and polymorphism. Through OOP, the code is modular, allowing for easy maintenance and extensibility. The chess game showcases Java's prowess in facilitating a structured and efficient approach to game development, providing an enjoyable and intellectually stimulating experience for players.",
    "projectID": 5,
    "projectTitle": "Chess Game Java Project",
    "projectType": "Other",
    "userID": 1
  },

  {
    "projectDesc": "The Caesar Cipher represents a traditional encryption method in which message characters are shifted by a fixed number of positions to generate a concealed message. Implemented in Java, it serves as an illustration of fundamental principles in data encryption.",
    "projectID": 7,
    "projectTitle": "Ceaser Cipher Java",
    "projectType": "Object oriented project",
    "userID": 1
  },
  
]

/*
const statementP = db.prepare ('INSERT INTO projects (projectID, userID, projectType, ProjectTitle, projectDesc) VALUES (?, ?, ?, ?, ?)')
dataProjects.forEach((pro)=>{
    statementP.run(pro.projectID, pro.userID, pro.projectType, pro.projectTitle, pro.projectDesc)
})
const statementExp = db.prepare('INSERT INTO experience (experienceID, userID, jobTitle, company, description) VALUES (?, ?, ?, ?, ?)');

dataExperience.forEach((exp) => {
    statementExp.run(exp.experienceID, exp.userID, exp.jobTitle, exp.company, exp.description);
});

// Do the same for other tables (user, education, projects) using prepared statements and the run method.

const statementU = db.prepare ('INSERT INTO user (userID, username, password, phone, email, role) VALUES ( ?, ?, ?, ?, ?, ?)')
dataUser.forEach((u)=>{
  statementU.run(u.userID, u.username, u.password, u.phone, u.email, u.role);
})
const statementEdu = db.prepare ('INSERT INTO education (educationID, userID, degree, school, description) VALUES (?, ?, ?, ?, ?)')
dataEducation.forEach((edu)=>{
    statementEdu.run(edu.educationID, edu.userID, edu.degree, edu.school, edu.description);
})
*/

// Do the same for other tables (user, education, projects) using prepared statements and the run method.



module.exports = db;
