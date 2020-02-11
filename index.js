const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

// let process = {
//   env: {
//     DATABASE_URL: 'postgres://hqweeralomggdr:628f3c100944e5cfe16049a1b19f3fcc455a168a6f2703ed488813633390fd80@ec2-34-192-30-15.compute-1.amazonaws.com:5432/d8hpekr59e45c8',
//     SENDGRID_API_KEY: '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'
//   }
// }

const PORT = process.env.PORT || 5000
const {
  Pool
} = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// MAKE CONNECTION TO DB HERE

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/reservations', (req, res) => res.render('pages/reservations'))
  .get('/email', (req, res) => res.render('pages/email'))
  .get('/reserve', async (req, res) => {
    try{
      let firstname = req.query.name;
      let lname = req.query.lname;
      let resname = req.query.resname
      let email = req.query.email;

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: 'mattcarterboivin@gmail.com',
        subject: `Reservation at ${resname}`,
        text: `Hey ${firstname},  your reservation at ${resname} has been made! We look forward to seeing you soon!`,
      };
      sgMail.send(msg);
      // ADD TO DB ALSO
      const client = await pool.connect()
      let sql = "INSERT INTO reservations (fname, lname, resname, email, reservationdate) VALUES ($1, $2, $3, $4, current_date)";
      let values = [firstname, lname, resname, email];
      const result = await client.query(sql, values);
      client.release();
      
      res.json({
        success: true
      });
    } catch(err) {
      console.log(err.message);
      res.json({
        success: false
      });
    }
  })
  .get('/checkReserve', async (req, res) => {
    try{
      let email = req.query.email;

      const client = await pool.connect()
      let sql = "SELECT * FROM reservations WHERE email = $1";
      let values = [email];
      const result = await client.query(sql, values);
      client.release();

      res.json({
        data: result.rows,
        success: true
      });
    } catch(err) {
      console.log(err.message);
      res.json({
        success : false
      });
    }
  })
  .get('/deleteReserve', async (req, res) => {
    try{
      let id = req.query.id;

      const client = await pool.connect()
      let sql = "DELETE FROM reservations WHERE id = $1";
      let values = [id];
      const result = await client.query(sql, values);
      client.release();

      res.json({
        success: true
      });
    } catch(err) {
      console.log(err.message);
      res.json({
        success : false
      });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))