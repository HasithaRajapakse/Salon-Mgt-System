const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));



const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "salon_database",
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});



// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads'); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name for the uploaded file
  }
});

const upload = multer({ storage: storage });






///////////////////////////register part////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

///////////////


// API End point to add cutomer/custmer registration
app.post('/register/customer', upload.single('image'), (req, res) => {
  const { username, password, firstName, lastName, gender, email, phone } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  if (!username || !password || !firstName || !lastName || !gender || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required except image' });
  }

  const usernameQuery = 'SELECT * FROM user WHERE username = ?';
  db.query(usernameQuery, [username], (usernameErr, usernameResult) => {
    if (usernameErr) {
      console.error('Error checking username:', usernameErr);
      return res.status(500).json({ message: 'Error checking username' });
    }

    if (usernameResult.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        return res.status(500).json({ message: 'Error hashing password' });
      }

      const userQuery = 'INSERT INTO user (username, password, role) VALUES (?, ?, ?)';
      db.query(userQuery, [username, hashedPassword, 'customer'], (userErr, userResult) => {
        if (userErr) {
          console.error('Error creating user:', userErr);
          return res.status(500).json({ message: 'Error creating user' });
        }

        const userId = userResult.insertId;

        const customerQuery = 'INSERT INTO customer (user_id, firstname, lastname, gender, email, phone, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(customerQuery, [userId, firstName, lastName, gender, email, phone, imageFilename], (customerErr, customerResult) => {
          if (customerErr) {
            console.error('Error creating customer:', customerErr);
            return res.status(500).json({ message: 'Error creating customer' });
          }

          res.status(201).json({ message: 'Customer registered successfully', customerId: customerResult.insertId });
        });
      });
    });
  });
});



// API End point to Add Staff

app.post('/register/staff', upload.single('image'), (req, res) => {
  const { username, password, role, firstName, lastName, gender, email, phone, nic } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  if (!username || !password || !role || !firstName || !lastName || !gender || !email || !phone || !nic || !imageFilename) {
    return res.status(400).json({ message: 'All fields are required' });
  }

                           // Check if username already exists
  const usernameQuery = 'SELECT * FROM user WHERE username = ?';
  db.query(usernameQuery, [username], (usernameErr, usernameResult) => {
    if (usernameErr) {
      console.error('Error checking username:', usernameErr);
      return res.status(500).json({ message: 'Error checking username' });
    }

    if (usernameResult.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

                          // Hash the password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        return res.status(500).json({ message: 'Error hashing password' });
      }

                         // Insert the user into the database
      const userQuery = 'INSERT INTO user (username, password, role) VALUES (?, ?, ?)';
      db.query(userQuery, [username, hashedPassword, role], (userErr, userResult) => {
        if (userErr) {
          console.error('Error creating user:', userErr);
          return res.status(500).json({ message: 'Error creating user' });
        }

        const userId = userResult.insertId;

                         // Insert the staff member into the database
        const staffQuery = 'INSERT INTO staff (user_id, firstname, lastname, gender, email, phone, nic, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(staffQuery, [userId, firstName, lastName, gender, email, phone, nic, imageFilename], (staffErr, staffResult) => {
          if (staffErr) {
            console.error('Error creating staff:', staffErr);
            return res.status(500).json({ message: 'Error creating staff' });
          }

          res.status(201).json({ message: 'Staff registered successfully', staffId: staffResult.insertId });
        });
      });
    });
  });
});



///////////////////////////Login part////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

///////////////
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE username = ?', [username], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (userResult.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    let userId;
    let name;

    if (user.role === 'customer') {
      const customerResult = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM customer WHERE user_id = ?', [user.user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      userId = customerResult[0].customer_id;
      name = `${customerResult[0].firstname} ${customerResult[0].lastname}`;
    } else {
      const staffResult = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM staff WHERE user_id = ?', [user.user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      userId = staffResult[0].staff_id;
      name = `${staffResult[0].firstname} ${staffResult[0].lastname}`;
    }

    res.json({ role: user.role, userId, name, name });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: 'Invalid username or password' });
  }
});


//////////////////////////////Admin///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//   (1)services section     //
// API Endpoint to Add a Service Category
app.post('/admin/addservicecategory', (req, res) => {
  const { categoryname, description } = req.body;
  
  if (!categoryname || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO servicecategory (categoryname, description) VALUES (?, ?)';
  db.query(query, [categoryname, description], (err, result) => {
    if (err) {
      console.error('Error adding service category:', err);
      return res.status(500).json({ message: 'Error adding service category' });
    }
    res.status(201).json({ message: 'Service category added successfully', categoryId: result.insertId });
  });
});

// API Endpoint to Fetch Service Categories
app.get('/admin/servicecategories', (req, res) => {
  const query = 'SELECT * FROM servicecategory';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching service categories:', err);
      return res.status(500).json({ message: 'Error fetching service categories' });
    }
    res.json(results);
  });
});

// API Endpoint to Add a Service Subcategory
app.post('/admin/addservicesubcategory', (req, res) => {
  const { servicecategory_id, subcategoryname, description } = req.body;

  if (!servicecategory_id || !subcategoryname || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO servicesubcategory (servicecategory_id, subcategoryname, description) VALUES (?, ?, ?)';
  db.query(query, [servicecategory_id, subcategoryname, description], (err, result) => {
    if (err) {
      console.error('Error adding service subcategory:', err);
      return res.status(500).json({ message: 'Error adding service subcategory' });
    }
    res.status(201).json({ message: 'Service subcategory added successfully', subcategoryId: result.insertId });
  });
});

// API Endpoint to Fetch Service Subcategories by Category ID
app.get('/admin/servicesubcategories/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const query = 'SELECT * FROM servicesubcategory WHERE servicecategory_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Error fetching service subcategories:', err);
      return res.status(500).json({ message: 'Error fetching service subcategories' });
    }
    res.json(results);
  });
});

// API Endpoint to Add a Service
app.post('/admin/addservice', upload.single('image'), (req, res) => {
  const { title, description, price, duration, servicesubcategory_id } = req.body;
  const imageFilename = req.file.filename;

  if (!title || !description || !price || !duration || !servicesubcategory_id || !imageFilename) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO service (title, description, price, duration, servicesubcategory_id, image) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, description, price, duration, servicesubcategory_id, imageFilename], (err, result) => {
    if (err) {
      console.error('Error adding service:', err);
      return res.status(500).json({ message: 'Error adding service' });
    }
    res.status(201).json({ message: 'Service added successfully', serviceId: result.insertId });
  });
});




// API Endpoint to View All Services with Category and Subcategory Names
app.get('/admin/adminviewservices', (req, res) => {
  const query = `
    SELECT s.service_id, s.title, s.description, s.price, s.duration, s.image,
           sc.categoryname AS category_name, ssc.subcategoryname AS subcategory_name
    FROM service s
    LEFT JOIN servicesubcategory ssc ON s.servicesubcategory_id = ssc.servicesubcategory_id
    LEFT JOIN servicecategory sc ON ssc.servicecategory_id = sc.servicecategory_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ message: 'Error fetching services' });
    }
    res.status(200).json(results);
  });
});

// API Endpoint to Fetch a Single Service by ID
app.get('/admin/admingetservice/:id', (req, res) => {
  const serviceId = req.params.id;
  db.query('SELECT * FROM service WHERE service_id = ?', [serviceId], (err, results) => {
    if (err) {
      console.error('Error fetching service:', err);
      return res.status(500).json({ message: 'Error fetching service' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(results[0]);
  });
});


// API Endpoint to Delete a Service
app.delete('/admin/admindeleteservice/:id', (req, res) => {
  const serviceId = req.params.id;

  db.query('SELECT image FROM service WHERE service_id = ?', [serviceId], (err, results) => {
    if (err) {
      console.error('Error fetching service:', err);
      return res.status(500).json({ message: 'Error fetching service' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const imageFilename = results[0].image;

    db.query('DELETE FROM service WHERE service_id = ?', [serviceId], (err, result) => {
      if (err) {
        console.error('Error deleting service:', err);
        return res.status(500).json({ message: 'Error deleting service' });
      }

      fs.unlink(path.join(__dirname, 'uploads', imageFilename), (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          return res.status(500).json({ message: 'Error deleting image file' });
        }

        res.status(200).json({ message: 'Service deleted successfully' });
      });
    });
  });
});

// API Endpoint to Update a Service
app.put('/admin/adminupdateservice/:id', upload.single('image'), (req, res) => {
  const serviceId = req.params.id;
  const { title, description, price, duration } = req.body;
  let query;
  let queryParams;

  if (req.file) {
    const imageFilename = req.file.filename;
    query = 'UPDATE service SET title = ?, description = ?, price = ?, duration = ?, image = ? WHERE service_id = ?';
    queryParams = [title, description, price, duration, imageFilename, serviceId];
  } else {
    query = 'UPDATE service SET title = ?, description = ?, price = ?, duration = ? WHERE service_id = ?';
    queryParams = [title, description, price, duration, serviceId];
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ message: 'Error updating service' });
    }
    res.status(200).json({ message: 'Service updated successfully' });
  });
});








//////////////////////////////Staff///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//API end point to view all staff memebers

app.get('/admin/adminviewstaff', (req, res) => {
  const staffQuery = `
    SELECT u.user_id, u.username, u.role, s.staff_id, s.firstname, s.lastname, s.gender, s.email, s.phone, s.image
    FROM user u
    JOIN staff s ON u.user_id = s.user_id
  `;
  db.query(staffQuery, (err, result) => {
    if (err) {
      console.error('Error fetching staff:', err);
      return res.status(500).json({ message: 'Error fetching staff' });
    }
    res.status(200).json(result);
  });
});

//API End point to  Delete a staff member

app.delete('/admin/admindeletestaff/:user_id', (req, res) => {
  const { user_id } = req.params;

  const deleteStaffQuery = 'DELETE FROM staff WHERE user_id = ?';
  const deleteUserQuery = 'DELETE FROM user WHERE user_id = ?';

  db.query(deleteStaffQuery, [user_id], (staffErr, staffResult) => {
    if (staffErr) {
      console.error('Error deleting staff:', staffErr);
      return res.status(500).json({ message: 'Error deleting staff' });
    }

    db.query(deleteUserQuery, [user_id], (userErr, userResult) => {
      if (userErr) {
        console.error('Error deleting user:', userErr);
        return res.status(500).json({ message: 'Error deleting user' });
      }

      res.status(200).json({ message: 'Staff member deleted successfully' });
    });
  });
});



// API Endpoint to Fetch a Single Staff Member by ID
app.get('/admin/admingetstaff/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT u.user_id, u.username, u.role, s.staff_id, s.firstname, s.lastname, s.gender, s.email, s.phone, s.nic, s.image
    FROM user u
    JOIN staff s ON u.user_id = s.user_id
    WHERE u.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching staff:', err);
      return res.status(500).json({ message: 'Error fetching staff' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(results[0]);
  });
});

// API Endpoint to Update a Staff member
app.put('/admin/adminupdatestaff/:id', upload.single('image'), (req, res) => {
  const userId = req.params.id;
  const { username, role, firstName, lastName, gender, email, phone, nic } = req.body;
  let query;
  let queryParams;

  if (req.file) {
    const imageFilename = req.file.filename;
    query = `
      UPDATE user u
      JOIN staff s ON u.user_id = s.user_id
      SET u.username = ?, u.role = ?, s.firstname = ?, s.lastname = ?, s.gender = ?, s.email = ?, s.phone = ?, s.nic = ?, s.image = ?
      WHERE u.user_id = ?
    `;
    queryParams = [username, role, firstName, lastName, gender, email, phone, nic, imageFilename, userId];
  } else {
    query = `
      UPDATE user u
      JOIN staff s ON u.user_id = s.user_id
      SET u.username = ?, u.role = ?, s.firstname = ?, s.lastname = ?, s.gender = ?, s.email = ?, s.phone = ?, s.nic = ?
      WHERE u.user_id = ?
    `;
    queryParams = [username, role, firstName, lastName, gender, email, phone, nic, userId];
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating staff:', err);
      return res.status(500).json({ message: 'Error updating staff' });
    }
    res.status(200).json({ message: 'Staff updated successfully' });
  });
});


////assigning services to staff members /////////
app.get('/admin/artists', (req, res) => {
  const query = `
    SELECT s.staff_id, s.firstname, s.lastname
    FROM staff s
    JOIN user u ON s.user_id = u.user_id
    WHERE u.role = 'artist'
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching artists:', err);
      return res.status(500).json({ message: 'Error fetching artists' });
    }
    res.json(results);
  });
});

app.get('/admin/services/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  const query = `
    SELECT s.service_id, s.title 
    FROM service s
    LEFT JOIN artistservice a ON s.service_id = a.service_id AND a.staff_id = ?
    WHERE a.staff_id IS NULL
  `;
  db.query(query, [artistId], (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ message: 'Error fetching services' });
    }
    res.json(results);
  });
});

app.post('/admin/assign-services', (req, res) => {
  const { staff_id, service_ids } = req.body;

  if (!staff_id || !service_ids || !Array.isArray(service_ids)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const values = service_ids.map(service_id => [staff_id, service_id]);

  const query = 'INSERT INTO artistservice (staff_id, service_id) VALUES ?';

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('Error assigning services:', err);
      return res.status(500).json({ message: 'Error assigning services' });
    }
    res.status(201).json({ message: 'Services assigned successfully' });
  });
});

// API Endpoint to Fetch Assigned Services by Artist ID
app.get('/admin/assigned-services/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  const query = `
    SELECT s.service_id, s.title
    FROM service s
    INNER JOIN artistservice a ON s.service_id = a.service_id
    WHERE a.staff_id = ?
  `;
  db.query(query, [artistId], (err, results) => {
    if (err) {
      console.error('Error fetching assigned services:', err);
      return res.status(500).json({ message: 'Error fetching assigned services' });
    }
    res.json(results);
  });
});

// Delete assigned service
app.delete('/admin/assigned-services/:staff_id/:service_id', (req, res) => {
  const { staff_id, service_id } = req.params;
  const query = 'DELETE FROM artistservice WHERE staff_id = ? AND service_id = ?';

  db.query(query, [staff_id, service_id], (err, result) => {
    if (err) {
      console.error('Error deleting assigned service:', err);
      return res.status(500).json({ message: 'Failed to unassign service' });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Service unassigned successfully' });
    } else {
      res.status(404).json({ message: 'Service not found for this artist' });
    }
  });
});











//////////////////////////////Customer///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// API Endpoint to Fetch All Customers
app.get('/admin/adminviewcustomers', (req, res) => {
  const customerQuery = `
    SELECT c.customer_id, c.firstname, c.lastname, c.gender, c.email, c.phone, c.image, u.username
    FROM customer c
    JOIN user u ON c.user_id = u.user_id
  `;
  db.query(customerQuery, (err, result) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ message: 'Error fetching customers' });
    }
    res.status(200).json(result);
  });
});

// API Endpoint to Count Customers
app.get('/admin/admincountcustomers', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM customer', (err, result) => {
    if (err) {
      console.error('Error counting customers:', err);
      return res.status(500).json({ message: 'Error counting customers' });
    }
    res.status(200).json(result[0].count);
  });
});











//////////////////////////////Booking Section///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


// Get all customers
app.get('/viewbookcustomers', (req, res) => {
  const query = 'SELECT customer_id, firstname, lastname FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Get all staff
app.get('/viewbookstaff', (req, res) => {
  const query = 'SELECT staff_id, firstname, lastname FROM staff';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Get all services
app.get('/viewbookservices', (req, res) => {
  const query = 'SELECT service_id, title FROM service';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

//filter bookings for admin choice filter
app.post('/viewbookings/filter', (req, res) => {
  const { customerId, staffId, serviceId, fromDate, toDate, bookingStatus } = req.body;
  let query = `
    SELECT 
      b.booking_id,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      CONCAT(s.firstname, ' ', s.lastname) AS staff_name,
      sv.title AS service_title,
      DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date,
      b.start_time,
      b.end_time,
      b.booking_status,
      b.created_at
    FROM 
      booking b
    JOIN
      customer c ON b.customer_id = c.customer_id
    JOIN
      staff s ON b.staff_id = s.staff_id
    JOIN
      service sv ON b.service_id = sv.service_id
    WHERE 1=1
  `;

  const params = [];
  if (customerId) {
    query += ' AND b.customer_id = ?';
    params.push(customerId);
  }
  if (staffId) {
    query += ' AND b.staff_id = ?';
    params.push(staffId);
  }
  if (serviceId) {
    query += ' AND b.service_id = ?';
    params.push(serviceId);
  }
  if (fromDate && toDate) {
    query += ' AND b.booking_date BETWEEN ? AND ?';
    params.push(fromDate, toDate);
  }
  if (bookingStatus) {
    query += ' AND b.booking_status = ?';
    params.push(bookingStatus);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});


// Get booking details by booking ID by admin
app.get('/viewbookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const query = `
    SELECT 
      b.booking_id,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      CONCAT(s.firstname, ' ', s.lastname) AS staff_name,
      sv.title AS service_title,
      DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date,
      b.start_time,
      b.end_time,
      b.booking_status,
      b.created_at
    FROM 
      booking b
    JOIN
      customer c ON b.customer_id = c.customer_id
    JOIN
      staff s ON b.staff_id = s.staff_id
    JOIN
      service sv ON b.service_id = sv.service_id
    WHERE 
      b.booking_id = ?
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      if (results.length === 0) {
        res.status(404).send('Booking not found');
      } else {
        res.json(results[0]);
      }
    }
  });
});


//booking cancellation 
// Get bookings with pending cancellation status
app.get('/bookings/cancellation-requests', (req, res) => {
  const query = `
    SELECT 
      b.booking_id,
      b.customer_id,
      b.staff_id,
      b.service_id,
      b.booking_date,
      b.start_time,
      b.end_time,
      b.booking_status,
      b.created_at,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      CONCAT(s.firstname, ' ', s.lastname) AS staff_name,
      sv.title AS service_title
    FROM 
      booking b
    JOIN
      customer c ON b.customer_id = c.customer_id
    JOIN
      staff s ON b.staff_id = s.staff_id
    JOIN
      service sv ON b.service_id = sv.service_id
    WHERE 
      b.booking_status = 'pending cancellation'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

//cancell booking
// Update booking status to 'cancelled'
app.put('/bookings/cancel/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const query = `
    UPDATE booking 
    SET booking_status = 'cancelled' 
    WHERE booking_id = ?
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.send('Booking status updated to cancelled');
    }
  });
});



//completee a booking
// Get booking details by booking ID
app.get('/completeabooking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const query = `
    SELECT 
      booking.booking_id, 
      booking.customer_id, 
      booking.staff_id, 
      booking.service_id, 
      booking.booking_date, 
      booking.start_time, 
      booking.end_time, 
      booking.booking_status, 
      booking.created_at,
      customer.firstname AS customer_firstname,
      customer.lastname AS customer_lastname,
      staff.firstname AS staff_firstname,
      staff.lastname AS staff_lastname,
      service.title AS service_title
    FROM booking
    JOIN customer ON booking.customer_id = customer.customer_id
    JOIN staff ON booking.staff_id = staff.staff_id
    JOIN service ON booking.service_id = service.service_id
    WHERE booking.booking_id = ?
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Booking not found');
    } else {
      res.json(results[0]);
    }
  });
});

// Backend endpoint to fetch payment details based on booking ID
app.get('/booking/payment/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const query = 'SELECT * FROM payment WHERE booking_id = ?';
  db.query(query, bookingId, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      if (results.length > 0) {
        res.json(results[0]); // Assuming only one payment record per booking ID
      } else {
        res.status(404).send('Payment details not found');
      }
    }
  });
});


// Backend endpoint to update payment status to paid
app.put('/payment/setaspaid/:paymentId', (req, res) => {
  const paymentId = req.params.paymentId;
  const query = 'UPDATE payment SET payment_status = "paid" WHERE payment_id = ?';
  db.query(query, paymentId, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.sendStatus(200);
    }
  });
});

// Backend endpoint to update booking status to completed
app.put('/completebooking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const query = 'UPDATE booking SET booking_status = "completed" WHERE booking_id = ?';
  db.query(query, bookingId, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.sendStatus(200);
    }
  });
});









//////////////////////////////Payment Section -Customer///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



// API Endpoint to View All Service Categories
app.get('/customer/viewservicecategories', (req, res) => {
  const query = 'SELECT servicecategory_id, categoryname FROM servicecategory';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching service categories:', err);
      return res.status(500).json({ message: 'Error fetching service categories' });
    }
    res.status(200).json(results);
  });
});

// API Endpoint to View Subcategories for a Given Category
app.get('/customer/viewservicesubcategories/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const query = 'SELECT servicesubcategory_id, subcategoryname FROM servicesubcategory WHERE servicecategory_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Error fetching service subcategories:', err);
      return res.status(500).json({ message: 'Error fetching service subcategories' });
    }
    res.status(200).json(results);
  });
});

// API Endpoint to View Services Based on Subcategory
app.get('/customer/viewservices', (req, res) => {
  const { subcategoryId } = req.query;
  let query = `
    SELECT s.service_id, s.title, s.description, s.price, s.duration, s.image,
           sc.categoryname, ssc.subcategoryname
    FROM service s
    INNER JOIN servicesubcategory ssc ON s.servicesubcategory_id = ssc.servicesubcategory_id
    INNER JOIN servicecategory sc ON ssc.servicecategory_id = sc.servicecategory_id
  `;
  const queryParams = [];

  if (subcategoryId) {
    query += ' WHERE s.servicesubcategory_id = ?';
    queryParams.push(subcategoryId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ message: 'Error fetching services' });
    }
    res.status(200).json(results);
  });
});




// Route to get service details by ID with category and subcategory names
app.get('/customer/viewservicedetails/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.service_id, s.title, s.description, s.price, s.duration, s.image,
           sc.categoryname AS category_name, ssc.subcategoryname AS subcategory_name
    FROM service s
    LEFT JOIN servicesubcategory ssc ON s.servicesubcategory_id = ssc.servicesubcategory_id
    LEFT JOIN servicecategory sc ON ssc.servicecategory_id = sc.servicecategory_id
    WHERE s.service_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching service details:', err);
      return res.status(500).json({ message: 'Error fetching service details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(results[0]);
  });
});

// API Endpoint to View All Artists
app.get('/customer/viewartists', (req, res) => {
  const query = `
    SELECT s.staff_id, s.firstname, s.lastname, s.gender, s.email, s.image
    FROM staff s
    INNER JOIN user u ON s.user_id = u.user_id
    WHERE u.role = 'artist'
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching artists:', err);
      return res.status(500).json({ message: 'Error fetching artists' });
    }
    res.status(200).json(results);
  });
});

// Route to get artist details by ID
app.get('/customer/viewartistdetails/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.staff_id, s.firstname, s.lastname, s.gender, s.email, s.image
    FROM staff s
    INNER JOIN user u ON s.user_id = u.user_id
    WHERE u.role = 'artist' AND s.staff_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching artist details:', err);
      return res.status(500).json({ message: 'Error fetching artist details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(results[0]);
  });
});


// API Endpoint to Fetch Staff List by Service ID
app.get('/customer/staff-list/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId;
  const query = `
    SELECT s.staff_id, CONCAT(s.firstname, ' ', s.lastname) AS staff_name
    FROM artistservice a
    INNER JOIN staff s ON a.staff_id = s.staff_id
    WHERE a.service_id = ?
  `;
  db.query(query, [serviceId], (err, results) => {
    if (err) {
      console.error('Error fetching staff list:', err);
      return res.status(500).json({ message: 'Error fetching staff list' });
    }
    res.json(results);
  });
});





/////////////////////////////Booking Section -Customer///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// API Endpoint to Fetch Artists (Staff Members)
app.get('/book/artists', (req, res) => {
  const query = `
    SELECT s.staff_id, s.firstname, s.lastname
    FROM staff s
    JOIN user u ON s.user_id = u.user_id
    WHERE u.role = 'artist'
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching artists:', err);
      return res.status(500).json({ message: 'Error fetching artists' });
    }
    res.json(results);
  });
});

// API Endpoint to Fetch Assigned Services by Artist ID
app.get('/book/assigned-services/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  const query = `
    SELECT a.staff_id, s.service_id, s.title AS service_title
    FROM artistservice a
    INNER JOIN service s ON a.service_id = s.service_id
    WHERE a.staff_id = ?
  `;
  db.query(query, [artistId], (err, results) => {
    if (err) {
      console.error('Error fetching assigned services:', err);
      return res.status(500).json({ message: 'Error fetching assigned services' });
    }
    res.json(results);
  });
});


// API Endpoint to Get Service Details (Duration and Price)
app.get('/book/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId;
  const query = 'SELECT duration, price FROM service WHERE service_id = ?';
  db.query(query, [serviceId], (err, result) => {
    if (err) {
      console.error('Error fetching service details:', err);
      return res.status(500).json({ message: 'Error fetching service details' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(result[0]);
  });
});




// API Endpoint to Create Booking
app.post('/customer/book-service', (req, res) => {
  const { customer_id, staff_id, service_id, booking_date, start_time, end_time, booking_status } = req.body;
  const query = `
    INSERT INTO booking (customer_id, staff_id, service_id, booking_date, start_time, end_time, booking_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [customer_id, staff_id, service_id, booking_date, start_time, end_time, booking_status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ message: 'Error creating booking' });
    }
    const booking_id = result.insertId; // Assuming MySQL returns the inserted id as insertId
    res.status(201).json({ message: 'Booking created successfully', booking_id });
  });
});


///payment enpoints
// API Endpoint to Get Booking Details
app.get('/booking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const query = `
    SELECT s.price
    FROM booking b
    INNER JOIN service s ON b.service_id = s.service_id
    WHERE b.booking_id = ?
  `;
  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error('Error fetching booking details:', err);
      return res.status(500).json({ message: 'Error fetching booking details' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(result[0]);
  });
});

// API Endpoint to Create Payment
app.post('/payments', (req, res) => {
  const { booking_id, amount, payment_method, payment_status } = req.body;
  const query = `
    INSERT INTO payment (booking_id, amount, payment_method, payment_status) 
    VALUES (?, ?, ?, ?)
  `;
  const values = [booking_id, amount, payment_method, payment_status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating payment:', err);
      return res.status(500).json({ message: 'Error creating payment' });
    }
    res.status(201).json({ message: 'Payment created successfully' });
  });
});


/////////////////////////////Customer My Data///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Filter bookings endpoint
app.post('/bookings/filter', (req, res) => {
  const { customerId, fromDate, toDate, status } = req.body;

  const query = `
    SELECT 
      b.booking_id, 
      b.customer_id, 
      b.staff_id, 
      s.firstname AS staff_firstname, 
      s.lastname AS staff_lastname, 
      b.service_id, 
      sv.title AS service_title, 
      sv.price AS service_price, 
      b.booking_date, 
      b.start_time, 
      b.end_time, 
      b.booking_status, 
      b.created_at
    FROM 
      booking b
    JOIN 
      staff s ON b.staff_id = s.staff_id
    JOIN 
      service sv ON b.service_id = sv.service_id
    WHERE 
      b.customer_id = ? 
      AND b.booking_date BETWEEN ? AND ?
      AND b.booking_status = ?
  `;

  db.query(query, [customerId, fromDate, toDate, status], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});


// Get booking details by booking ID and customer ID endpoint
app.post('/bookings/details', (req, res) => {
  const { customerId, bookingId } = req.body;

  const query = `
    SELECT * FROM booking 
    WHERE booking_id = ? AND customer_id = ?
  `;

  db.query(query, [bookingId, customerId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('No booking found with this ID or it does not belong to you.');
    }
  });
});


// Handle cancellation request endpoint
app.post('/bookings/cancel', (req, res) => {
  const { bookingId } = req.body;

  const query = `
    UPDATE booking 
    SET booking_status = 'pending cancellation' 
    WHERE booking_id = ?
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.send('Requested for cancellation');
    }
  });
});


// Filter payments endpoint
app.post('/payments/filter', (req, res) => {
  const { customerId, fromDate, toDate, status } = req.body;

  const query = `
    SELECT 
      p.payment_id,
      p.booking_id,
      p.amount,
      p.payment_method,
      p.payment_status,
      p.created_at,
      p.updated_at,
      b.customer_id
    FROM 
      payment p
    JOIN
      booking b ON p.booking_id = b.booking_id
    WHERE 
      b.customer_id = ? 
      AND p.created_at BETWEEN ? AND ?
      AND p.payment_status = ?
  `;

  db.query(query, [customerId, fromDate, toDate, status], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});


// Search payment by booking ID endpoint
app.post('/payments/search', (req, res) => {
  const { bookingId, customerId } = req.body; // Get customerId from the request body

  const query = `
    SELECT 
      p.payment_id,
      p.booking_id,
      p.amount,
      p.payment_method,
      p.payment_status,
      p.created_at,
      p.updated_at
    FROM 
      payment p
    JOIN 
      booking b ON p.booking_id = b.booking_id
    WHERE 
      p.booking_id = ? AND b.customer_id = ?
  `;

  db.query(query, [bookingId, customerId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('No payment found for this booking ID or booking ID does not belong to the customer');
    } else {
      res.json(results);
    }
  });
});



// Update payment status endpoint
app.post('/payments/update', (req, res) => {
  const { bookingId, paymentMethod, paymentStatus } = req.body;

  const query = `
    UPDATE payment 
    SET payment_method = ?, payment_status = ? 
    WHERE booking_id = ?
  `;

  db.query(query, [paymentMethod, paymentStatus, bookingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.send('Payment updated successfully');
    }
  });
});


// Handle updating user password endpoint
app.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const updateQuery = 'UPDATE user SET password = ? WHERE user_id = ?';
    db.query(updateQuery, [hashedPassword, userId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        res.status(500).json({ message: 'Error updating password' });
      } else {
        res.status(200).json({ message: 'Password updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
});





/////////////////////////////Leave Section///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// API Endpoint to Fetch Staff Members
app.get('/staff/members', (req, res) => {
  const query = `
    SELECT s.staff_id, s.firstname, s.lastname
    FROM staff s
    JOIN user u ON s.user_id = u.user_id
    WHERE u.role = 'artist'
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching staff members:', err);
      return res.status(500).json({ message: 'Error fetching staff members' });
    }
    res.json(results);
  });
});


// API Endpoint to Add a Leave Record
app.post('/staff/leave', (req, res) => {
  const { staffId, leaveDate } = req.body;
  const query = 'INSERT INTO `leave` (staff_id, date) VALUES (?, ?)';
  db.query(query, [staffId, leaveDate], (err, results) => {
    if (err) {
      console.error('Error adding leave record:', err);
      return res.status(500).json({ message: 'Error adding leave record' });
    }
    res.status(201).json({ message: 'Leave record added successfully' });
  });
});

// API Endpoint to Fetch Leave Dates for a Staff Member
app.get('/staff/leave/:staffId', (req, res) => {
  const { staffId } = req.params;
  const query = 'SELECT date FROM `leave` WHERE staff_id = ?';
  db.query(query, staffId, (err, results) => {
    if (err) {
      console.error('Error fetching leave dates:', err);
      return res.status(500).json({ message: 'Error fetching leave dates' });
    }
    const leaveDates = results.map(result => result.leave_date);
    res.json(leaveDates);
  });
});



/////////////////////////////Admin Dashboard///////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// Endpoint to fetch total customers
app.get('/admin/total-customers', (req, res) => {
  const query = 'SELECT COUNT(*) AS totalCustomers FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total customers:', err);
      return res.status(500).json({ message: 'Error fetching total customers' });
    }
    res.json(results[0]);
  });
});

// Endpoint to fetch total artists
app.get('/admin/total-artists', (req, res) => {
  const query = 'SELECT COUNT(*) AS totalArtists FROM staff';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total artists:', err);
      return res.status(500).json({ message: 'Error fetching total artists' });
    }
    res.json(results[0]);
  });
});

// Endpoint to fetch total services
app.get('/admin/total-services', (req, res) => {
  const query = 'SELECT COUNT(*) AS totalServices FROM service';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total services:', err);
      return res.status(500).json({ message: 'Error fetching total services' });
    }
    res.json(results[0]);
  });
});

// Endpoint to fetch today's bookings
app.get('/admin/todays-bookings', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const query = `
    SELECT b.booking_id, c.firstname AS customer_firstname, c.lastname AS customer_lastname, 
           s.firstname AS staff_firstname, s.lastname AS staff_lastname, se.title AS service_title, 
           b.booking_date, b.start_time, b.end_time, b.booking_status
    FROM booking b
    JOIN customer c ON b.customer_id = c.customer_id
    JOIN staff s ON b.staff_id = s.staff_id
    JOIN service se ON b.service_id = se.service_id
    WHERE b.booking_date = ?
  `;
  db.query(query, [today], (err, results) => {
    if (err) {
      console.error('Error fetching today\'s bookings:', err);
      return res.status(500).json({ message: 'Error fetching today\'s bookings' });
    }
    res.json(results);
  });
});










const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
