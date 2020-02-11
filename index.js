//Import Required packages
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

//Let Heroku Set Port in environment. Otherwise default to 5000 
const PORT = process.env.PORT || 5000

//Connect to Postgres
const {
  Pool
} = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

//Express Routing of endpoints
express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //Home page
  .get('/', (req, res) => res.render('pages/index'))
  //Reservation Viewing Page
  .get('/reservations', (req, res) => res.render('pages/reservations'))
  //Reservation Booking Page
  .get('/email', (req, res) => res.render('pages/email'))
  //Reservation Maker Endpoint
  .get('/reserve', async (req, res) => {
    try {
      //Get info from request query
      let firstname = req.query.name;
      let lname = req.query.lname;
      let resname = req.query.resname
      let email = req.query.email;
      //Require Sendgrid Mail Helper
      const sgMail = require('@sendgrid/mail');
      //Set the API key
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      //Compose the Email
      const msg = {
        to: email,
        from: 'mattcarterboivin@gmail.com',
        subject: `Reservation at ${resname}`,
        text: `Hey ${firstname},  your reservation at ${resname} has been made! We look forward to seeing you soon!`,
      };
      //Send the Email
      sgMail.send(msg);
      //Connect to the Database
      const client = await pool.connect()
      //Insert statement
      let sql = "INSERT INTO reservations (fname, lname, resname, email, reservationdate) VALUES ($1, $2, $3, $4, current_date)";
      let values = [firstname, lname, resname, email];
      //Query the database
      const result = await client.query(sql, values);
      //Release the Connection
      client.release();
      //On success, set result Success: true. On failure set result Success: false
      res.json({
        success: true
      });
    } catch (err) {
      console.log(err.message);
      res.json({
        success: false
      });
    }
  })
  //Check reservation endpoint
  .get('/checkReserve', async (req, res) => {
    try {
      //get email from request query
      let email = req.query.email;
      //Database connection and Query
      const client = await pool.connect()
      let sql = "SELECT * FROM reservations WHERE email = $1";
      let values = [email];
      const result = await client.query(sql, values);
      //Release the DB connection
      client.release();
      //Respond with the data as well as a success
      res.json({
        data: result.rows,
        success: true
      });
      //If error, resond with a failure
    } catch (err) {
      console.log(err.message);
      res.json({
        success: false
      });
    }
  })
  //Delete Reservation Endpoint
  .get('/deleteReserve', async (req, res) => {
    try {
      //Get the ID from the request query
      let id = req.query.id;
      //DB Connection and Query
      const client = await pool.connect()
      let sql = "DELETE FROM reservations WHERE id = $1";
      let values = [id];
      const result = await client.query(sql, values);
      //Release the DB Connection
      client.release();
      //Set response success to true
      res.json({
        success: true
      });
      //If error, set response success to false
    } catch (err) {
      console.log(err.message);
      res.json({
        success: false
      });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))