const express = require('express');
const multer = require('multer');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Change to your uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Employee Routes
router.get('/',employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.get('/check-email', employeeController.checkEmailExists);

router.post('/create-employee',upload.single('image'),employeeController.validateEmployee, employeeController.createEmployee);

router.put('/edit-employee/:id', upload.single('image'),employeeController.validateEmployee, employeeController.updateEmployee);

router.delete('/delete-employee/:id', employeeController.deleteEmployee);

module.exports = router;
