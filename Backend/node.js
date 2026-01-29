app.post('/ReactTask', async (req, res) => {
    console.log('📝 Registration request received');
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    
    // Enhanced CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // Validate required fields
        if (!req.body.Email || !req.body.Password || !req.body.Firstname || !req.body.Lastname) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields' 
            });
        }
        
        const checkSql = 'SELECT * FROM Registration WHERE Email = ? OR MeterNumber = ?';
        const checkValues = [req.body.Email, req.body.MeterNumber];
        
        connection.query(checkSql, checkValues, (checkErr, checkResults) => {
            if (checkErr) {
                console.log('Database check error:', checkErr);
                return res.status(500).json({ 
                    success: false,
                    error: 'Database error during check' 
                });
            }
            
            console.log('Check results:', checkResults);
            
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
            
            // Hash password
            bcrypt.hash(req.body.Password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.log('Password hash error:', hashErr);
                    return res.status(500).json({ 
                        success: false,
                        error: 'Server error' 
                    });
                }
                
                console.log('Password hashed successfully');
                
                // Insert into database
                const insertSql = `
                    INSERT INTO Registration 
                    (Firstname, Lastname, NationalId, Telephone, Email, Password, 
                     District, MeterNumber, PhaseType, Declaration) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                const insertValues = [
                    req.body.Firstname,
                    req.body.Lastname,
                    req.body.NationalId || null,
                    req.body.Telephone || null,
                    req.body.Email,
                    hashedPassword,
                    req.body.District || null,
                    req.body.MeterNumber || null,
                    req.body.PhaseType || null,
                    req.body.Declaration || false
                ];
                
                console.log('Insert values:', insertValues);
                
                connection.query(insertSql, insertValues, (insertErr, result) => {
                    if (insertErr) {
                        console.log('Database insert error:', insertErr);
                        return res.status(500).json({ 
                            success: false,
                            error: 'Failed to save to database: ' + insertErr.message 
                        });
                    }
                    
                    console.log('✅ User saved successfully, ID:', result.insertId);
                    return res.json({ 
                        success: true,
                        message: 'Registration successful',
                        id: result.insertId 
                    });
                });
            });
        });
        
    } catch (error) {
        console.log('Unexpected error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Server error: ' + error.message 
        });
    }
});