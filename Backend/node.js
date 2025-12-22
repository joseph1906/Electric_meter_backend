const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json()); 

const pool = mysql.createPool({
    host: process.env.DatabaseHost,
    user: process.env.DatabaseUser,
    password: process.env.DatabasePassword,
    database: process.env.DatabaseName,
    port: process.env.DatabasePort || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/ReactTask', async (req, res) => {
    try {
        const requiredFields = ['Firstname', 'Lastname', 'Email', 'Password', 'District', 'MeterNumber'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        
        const sql = 'INSERT INTO Registration (Firstname, Lastname, Email, Password, District, MeterNumber, PhaseType, InstallationDate, PaymentMode, Declaration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            req.body.Firstname,
            req.body.Lastname,
            req.body.Email,
            hashedPassword,
            req.body.District,
            req.body.MeterNumber,
            req.body.PhaseType || null,
            req.body.InstallationDate || null,
            req.body.PaymentMode || null,
            req.body.Declaration || false
        ];

        pool.execute(sql, values, (err, data) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database operation failed' });
            }
            return res.status(201).json({ 
                message: 'User created successfully', 
                id: data.insertId 
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}).noeon('error', (err) => {
    console.error('Server failed to start:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Try a different port.`);
    }
});