const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');
const generateToken = require('../utils/generateToken')
const generateRefreshToken = require('../utils/generateRefreshToken');

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset }
}

const schemaRegister = Joi.object({
    enrollment: Joi.string(),
    company_name: Joi.string().min(4).max(100).required(),
    contact_name: Joi.string().min(4).max(100).required(),
    contact_role: Joi.string().min(4).max(100).required(),
    address: Joi.string().min(4).max(100).required(),
    country: Joi.string().min(3).max(25).required(),
    state: Joi.string().min(3).max(25).required(),
    city: Joi.string().min(3).max(25).required(),
    postalCode: Joi.number().required(),
    phone: Joi.number().required(),
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(1024).required(),
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

module.exports = {
    async newCustomer (req, res) {
        try {
            // Validate user
            const { error } = schemaRegister.validate(req.body)
             
            if (error) {
                return res.status(400).json({error: error.details[0].message})
            }
   
            const isEmailExist = await Customer.findOne({ email: req.body.email });
            if (isEmailExist) {
                return res.status(400).json({error: 'Email already registered'})
            }
   
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt)
   
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const registeredDate = [year, month, day].join('-')
   
            //const uuid = uuidv4()
            const companyName = req.body.company_name
            //const matches = companyName.match(/\b(\w)/g)
            //const acronym = matches.join('')
            const acronym = companyName.match(/[A-Z]/g).join('')

            const randomNumber = (Math.floor(100000 + Math.random() * 900000))
   
            const enrollment = `JAAD-C-${registeredDate}-${acronym}-${randomNumber}`
            console.log(enrollment)
   
            const customer = new Customer({
               enrollment: enrollment,
               company_name: req.body.company_name,
               contact_name: req.body.contact_name,
               contact_role: req.body.contact_role,
               address: req.body.address,
               country: req.body.country,
               state: req.body.state,
               city: req.body.city,
               postalCode: req.body.postalCode,
               phone: req.body.phone,
               email: req.body.email,
               password: password
            })
   
            await customer.save()
   
            const { token, expiresIn } = generateToken(customer._id)
            generateRefreshToken(customer._id, res)
   
            return res.status(201).json({ token, expiresIn })
        } catch (err) {
            if (err.code == 11000) {
                return res.status(400).json({
                    error: 'Customer already exists!'
                })
            }
            return res.status(500).json({
                error: 'ERROR WITH THE SERVER!'
            })
        }
    },

    async getCustomers (req, res) {
        const { page, size, company_name } = req.query
        var condition = company_name
            ? { company_name: { $regex: new RegExp(company_name), $options: "i"}}
            : {}

        const { limit, offset } = getPagination(page, size)

        await Customer.paginate(condition, { offset, limit })
            .then((data) => {
                data.docs.forEach(element => {
                    element.password = undefined
                });
                
                res.send({
                    totalItems: data.totalDocs,
                    customers: data.docs,
                    totalPages: data.totalPages,
                    currentPage: data.page - 1
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                    err.message || 'Some error occurred while retrieving customers'
                })
            })
    },

    async getCustomerById (req, res) {
        console.log('Hi')
    },

    async deleteCustomer (req, res) {
        console.log('Hi')
    },

    async deleteAllCustomers (req, res) {
        console.log('Hi')
    },

    async deleteCustomerById (req, res) {
        console.log('Hi')
    },

    async updateCustomerById (req, res) {
        console.log('Hi')
    }
}