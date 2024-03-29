const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// MySQL connection configuration
const connection = mysql.createConnection({
    host: '10.0.1.43',
    user: 'SSS',
    password: 'Tensui@220424',
    database: 'sampleappdb'
});


// Use the new connection to execute queries
connection.query('SELECT * FROM three_tier', (err, results) => {
    if (err) {
        console.error('Error executing query:', err);
        return;
    }
    console.log(results);
});

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const empId = req.body.empId;

// Server-side validation
  if (!name || !empId) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  // Check for duplicate entries
  const query = 'SELECT * FROM employees WHERE emp_id = ?';
  connection.query(query, [empId], (err, results) => {
    if (err) {
      console.error('Error checking for duplicates:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Employee ID already exists' });
    }
    // Insert data into the database
    const query = 'INSERT INTO three_tier (Name, EmpID) VALUES (?, ?)';
    connection.query(query, [name, empId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            // Include the SQL query in the error response for debugging
           res.status(500).send('Error inserting data: ' + err.sqlMessage);
        } else {
            console.log('Data inserted successfully');
            res.send('Data inserted successfully');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('App server listening on port 3000');
});
