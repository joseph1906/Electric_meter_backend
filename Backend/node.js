const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const connection = mysql.createConnection({
    host: process.env.DatabaseHost,
    user: process.env.DatabaseUser,
    password: process.env.DatabasePassword,
    database: process.env.DatabaseName,
});

connection.connect((err) => {
    if (err) {
        console.log('Database error:', err.message);
    } else {
        console.log('✅ Connected to MySQL');
    }
});

app.post('/ReactTask', async (req, res) => {
    console.log('📝 Registration request received');
    
    try {
        const checkSql = 'SELECT * FROM Registration WHERE Email = ? OR MeterNumber = ?';
        const checkValues = [req.body.Email, req.body.MeterNumber];
        
        connection.query(checkSql, checkValues, (checkErr, checkResults) => {
            if (checkErr) {
                console.log('Check error:', checkErr.message);
                return res.json({ error: 'Server error' });
            }
            
            if (checkResults.length > 0) {
                const existingUser = checkResults[0];
                
                if (existingUser.Email === req.body.Email) {
                    console.log('❌ Email already registered:', req.body.Email);
                    return res.json({ 
                        success: false,
                        error: 'Email is already registered' 
                    });
                }
                
                if (existingUser.MeterNumber === req.body.MeterNumber) {
                    console.log('❌ Meter number already registered:', req.body.MeterNumber);
                    return res.json({ 
                        success: false,
                        error: 'Meter number is already registered' 
                    });
                }
            }
            
            bcrypt.hash(req.body.Password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.log('Hash error:', hashErr.message);
                    return res.json({ error: 'Server error' });
                }
                
                const insertSql = `
                    INSERT INTO Registration 
                    (Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                const insertValues = [
                    req.body.Firstname,
                    req.body.Lastname,
                    req.body.NationalId || null,
                    req.body.Telephone || null,
                    req.body.Email,
                    hashedPassword,
                    req.body.District,
                    req.body.MeterNumber,
                    req.body.PhaseType || null,
                    req.body.Declaration || false
                ];
                
                connection.query(insertSql, insertValues, (insertErr, result) => {
                    if (insertErr) {
                        console.log('Insert error:', insertErr.message);
                        return res.json({ error: 'Failed to save to database' });
                    }
                    
                    console.log('✅ User saved, ID:', result.insertId);
                    return res.json({ 
                        success: true,
                        message: 'Registration successful',
                        id: result.insertId 
                    });
                });
            });
        });
        
    } catch (error) {
        console.log('Error:', error.message);
        res.json({ error: 'Server error' });
    }
});

// Change this line at the bottom:
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running at:`);
    console.log(`   Local: http://localhost:${port}`);
    console.log(`   Network: http://YOUR_IP:${port}`);
    console.log(`📝 Use the Network URL on your phone!`);
});