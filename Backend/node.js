const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DatabaseHost,
    user: process.env.DatabaseUser,
    password: process.env.DatabasePassword,
    database: process.env.DatabaseName,
    port: process.env.DatabasePort
}

const connection = mysql.createConnection(dbConfig);
connection.connect(err => {
    if (err) {
        console.error('Connection failed:', err);
    } else {
        console.log('Connected to database');
    }
});
app.get('/', (req, res)=> {
    res.json({message: 'The server is running'});
});

app.get('/ReactTask', (req, res) => {
    connection.query('SELECT * FROM Registration', (err, result)=> {
        if (err) {
            console.error('Error Database query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json(result);
    })

 })

 app.post('/ReactTask', (req, res) => {
    const { Firstname, Lastname, NationalId, Email, Password, District, MeterNumber, PhaseType, InstallationDate, Telephone } = req.body;
    connection.query(
        'INSERT INTO Registration (Firstname, Lastname, NationalId, Email, Password, District, MeterNumber, PhaseType, InstallationDate, Telephone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Firstname, Lastname, NationalId, Email, Password, District, MeterNumber, PhaseType, InstallationDate, Telephone],
        (err) => {
            if (err) {
                res.json({success: false, message: 'Error inserting data'});
            } else {
                res.json({success: true, message: 'Data inserted successfully'});
            }
        }
    );
 });

 app.listen(port, () => {
    console.log(`Belly  is running on port ${port}/save-user`);
 })