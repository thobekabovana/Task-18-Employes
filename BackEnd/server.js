
const express = require('express');
const admin = require('./firebase-require');  // Ensure this initializes Firebase Admin SDK correctly
const db = admin.firestore();  // Initialize Firestore
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());

// Firestore collection reference for employees
const employeesRef = db.collection('employees');

// Define router
const router = express.Router();

// Welcome route - Displays "Welcome to SA"
router.get('/', (req, res) => {
  console.log("Welcome to SA");
  res.send("Welcome to SA"); 
});

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName, companyNumber, role } = req.body;

    // Check if the company already exists and get the document reference
    const userRef = await db.collection('users').where('companyNumber', '==', companyNumber).get();

    if (!userRef.empty) {
      return res.status(400).json({ message: 'Company number already registered' });
    }

    // Add user to Firestore with a document ID under their company number
    await db.collection('users').add({
      name,
      email,
      password, // Consider hashing passwords before storing
      companyName,
      companyNumber,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// POST /login - Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query Firestore for a user with the matching email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    let user;
    userSnapshot.forEach(doc => {
      if (doc.data().password === password) {
        user = { id: doc.id, ...doc.data() };
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Respond with success (and optionally, send user data or token)
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// POST /employees - Add a new employee
router.post('/employees', async (req, res) => {
  try {
    const employeeData = req.body; // Get employee data from request body
    const newEmployeeRef = await employeesRef.add(employeeData);
    res.status(201).json({ id: newEmployeeRef.id, ...employeeData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error: error.message });
  }
});

// GET /employees - Get all employees
router.get('/employees', async (req, res) => {
  try {
    const snapshot = await employeesRef.get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

// GET /employees/:id - Get a single employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const doc = await employeesRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

// PUT /employees/:id - Update an existing employee
router.put('/employees/:id', async (req, res) => {
  try {
    const employeeData = req.body;
    await employeesRef.doc(req.params.id).update(employeeData);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

// DELETE /employees/:id - Delete an employee by ID
router.delete('/employees/:id', async (req, res) => {
  try {
    await employeesRef.doc(req.params.id).delete();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// Use the router for /api routes
app.use('/api', router);
app.use('/', router); // Ensure this is placed after your routes definition

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = admin;
