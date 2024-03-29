const express = require('express');
const { engine } = require('express-handlebars');
const db = require('./infodatabase')
const bodyParser = require('body-parser')
const session = require('express-session');
const connect = require('connect-sqlite3');
//const cookieParser = require('cookie-parser')
const connectSqlite3 = require('connect-sqlite3');
const { LIMIT_EXPR_DEPTH } = require('sqlite3');
const bcrypt = require("bcrypt")
const saltRounds = 10;
const app = express();
const port = 8080


//connect to the database located in the model folder.
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

app.set('view engine', 'handlebars');

// define static directory "public"
app.use(express.static('public'))

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url)
  next()
})

//Post forms 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Store session in the database
const SQLiteStore = connectSqlite3(session)

app.use(session({
  store: new SQLiteStore({ db: "session-db.db" }),
  saveUninitialized: false,
  resave: false,
  secret: "61Om318808"
}));

//Routes
app.get('/', (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('home', model);
});

app.get('/projects', (req, res) => {
  db.all("SELECT * FROM projects", (err, data) => {
    if (err) {

    } else {

      const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        projects: data,
        helpers: {
          check(aa) {
            if (req.session.isAdmin) return true;
            else return false;
          }
        }
      }
      res.status(200).render('projects.handlebars', model);
    }
  })
});

app.get('/about', (req, res) => {
  db.all('SELECT * FROM education', (err, edu) => {
    if (err) {


    } else {
      const myEdu = edu;
      db.all('SELECT * FROM experience', (err, exp) => {
        if (err) {

        } else {
          const myExp = exp;
          const model = {
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
            education: myEdu,
            experience: myExp
          }
          res.status(200).render('about.handlebars', model);
        }
      })

    }
  })
});


app.get('/contact', (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('contact.handlebars', model);
});

app.get('/project-more/:id', (req, res) => {
  const id= req.params.id
  console.log('Received project ID:', id);
  db.get("SELECT * FROM projects WHERE projectID=?", [id], function (error, theProjects) {
    if (error) {
    } else {
      console.log(theProjects);
      const model = {
        project: theProjects,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      console.log(model)
      res.render("project-more.handlebars", model); 
    }
  }) 
});


app.post('/createPro', (req, res) => {
  console.log(req.body);
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  };
  db.run("INSERT INTO projects (projectTitle, projectType, projectDesc) VALUES (?, ?, ?)", [req.body.title, req.body.info, req.body.desc], (error) => {
    if (error) {
    } else {
      res.status(201).redirect("/projects")
    }
  })
})
const updateProject = (updateID, req, res) => {
  db.all("SELECT * FROM projects WHERE projectsID = ?"[updateID], (dbPro, err) => {
    if (err) {
      //gör något om du inte hittar datan här

    } else {
      const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        t: dbPro.projectTitle,
        i: dbPro.projectType,
        d: dbPro.projectDesc,
        id: updateID

      }
      res.render('update.handlebars', model)

    }
  })
}
app.post('/updatePro', (req, res) => {
  var sqlQuery = `UPDATE projects SET projectType = ?, projectTitle = ?, projectDesc = ? WHERE projectID = ?`;
  db.run(sqlQuery, [req.body.projectType, req.body.projectTitle, req.body.projectDesc, req.body.id], (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/projects')
    }
  });


})
///DELETE
app.post('/buttonProject', (req, res) => {
  let delID = req.body.del;
  let updateID = req.body.up;
  if (delID) {
    db.run("DELETE FROM projects WHERE projectID = ?", [delID], (error) => {
      if (error) {
      } else {
        res.status(200).redirect("/projects")
      }
    })

  } else return updateProject(updateID, req, res);
}
)

app.get('/login', (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('login.handlebars', model);
});

async function comparePasswords(plainTextPassword, hashedPassword) {
  try {
    if (!plainTextPassword || !hashedPassword) {
      console.error('Both plainTextPassword and hashedPassword must be provided');
      return [false, true];
    }
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return [match, false];
  } catch (error) {
    return [false, true];
  }
}
app.post('/login', (req, res) => {
  const user = req.body.user;
  const plainTextPassword = req.body.pw;

  // Retrieve the hashed password from your database based on the username
  const sql = 'SELECT username, password, role FROM user WHERE username = ?';


  db.get(sql, [user], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (row) {
      const hashedPasswordFromDatabase = row.password;
      const [result, compareErr] = await comparePasswords(plainTextPassword, hashedPasswordFromDatabase)

      // Compare the hashed password with the provided plain text password
      if (compareErr) {
        console.error(compareErr);
        return res.status(500).send('Internal Server Error');
      }

      if (result) {
        console.log(`${user} successfully logged in!`);

        req.session.isAdmin = (row.role == 1);
        req.session.isLoggedIn = true;
        req.session.name = user;
        res.redirect('/');
      } else {

        console.log('Login was unsuccessful, wrong user/password!');
        req.session.isAdmin = false;
        req.session.isLoggedIn = false;
        req.session.name = '';
        res.redirect('/login');
      }

    } else {
      // User not found in the database
      console.log('User not found');
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = '';
      res.redirect('/login');
    }
  });
});

app.get('/', (req, res) => {
  console.log("Session:", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  };
  res.render('home.handlebars', model);
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log("Error")
  })
  console.log('Logged out..')
  res.redirect('/')
});



// run the server and make it listen to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`)
});