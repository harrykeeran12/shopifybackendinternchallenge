/*
This file is the backend.
This file needs to house a create(POST method), read(GET method), update(PUT method) and delete(DELETE method). It will use express.js to create an API, and mysql to access/modify the database.
*/

/* Dependencies */
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyparser = require('body-parser');
app = express()

/*Assigns a port number. */
let server = { 
  port: 3306
}
/*Uses the dependencies cors and body-parser, so that the output is more readable. */
app.use(cors())
app.use(bodyparser.json())

/*Connects to the database. */

let db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  port: server.port
})

/*Create new database: 
CREATE TABLE `inventory`.`logistics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `inventory_name` VARCHAR(255) NOT NULL,
  `storage_date` DATE NOT NULL,
  `amount` INT NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));
  */

db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});










app.listen(server.port, () => console.log(`Server started, listening port: ${server.port}`))







