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
      console.log(data);
      const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        projects: data
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
          console.log(myEdu);
          console.log(myExp);
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
  console.log("Session: ", req.session)
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