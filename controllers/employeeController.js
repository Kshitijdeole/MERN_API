const Employee = require('../models/employeeModel');
const { body, validationResult } = require('express-validator');

// Middleware for validating employee creation
// Middleware for validating employee creation
exports.validateEmployee = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid').custom(async (email) => {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            throw new Error('Email already in use');
        }
    }),
    body('mobileNo')
        .isNumeric().withMessage('Mobile No must be numeric')
        .notEmpty().withMessage('Mobile No is required')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile No must be 10 digits long'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('course').notEmpty().withMessage('Course is required'),
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image upload is required');
        }
        const validFileTypes = ['image/jpeg', 'image/png'];
        if (!validFileTypes.includes(req.file.mimetype)) {
            throw new Error('Only jpg/png files are allowed');
        }
        return true;
    })
];


// Handle employee creation
exports.createEmployee = async (req, res) => {

    console.log('Request body:', req.body); // Check if data is coming through
    console.log('File:', req.file);

    const errors = validationResult(req);
    console.log('Validation Errors:', errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const employee = new Employee({
            name: req.body.name,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            designation: req.body.designation,
            gender: req.body.gender,
            course: req.body.course,
            imgUpload: req.file.path // Adjust as necessary
        });

        await employee.save();
        res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
};

// Check if email exists
exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingEmployee = await Employee.findOne({ email: email });
        if (existingEmployee) {
            return res.status(200).json({ exists: true, message: 'Email already exists' });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking email', error });
    }
};


// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = req.body.name || employee.name;
        employee.email = req.body.email || employee.email;
        employee.mobileNo = req.body.mobileNo || employee.mobileNo;
        employee.designation = req.body.designation || employee.designation;
        employee.gender = req.body.gender || employee.gender;
        employee.course = req.body.course || employee.course;

        if (req.file) {
            employee.image = req.file.path;
        }

        await employee.save();
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(400).json({ message: 'Error updating employee', error });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.deleteOne({_id:req.params.id});
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};
