const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const customerSchema = mongoose.Schema({
    enrollment: {
        type: String,
        unique: [true, "enrollment already exists in database!"],
    },
    company_name: {
        type: String,
        required: [true, "company_name not provided "],
    },
    contact_name: {
        type: String,
        required: [true, "contact_name not provided "],
    },
    contact_role: {
        type: String,
        required: [true, "contact_role not provided "],
    },
    address: {
        type: String,
        required: [true, "address not provided "],
    },
    country: {
        type: String,
        required: [true, "country not provided "],
    },
    state: {
        type: String,
        required: [true, "state not provided "],
    },
    city: {
        type: String,
        required: [true, "city not provided "],
    },
    postalCode: {
        type: Number,
        required: [true, 'postalCode not prived'],
    },
    phone: {
        type: Number,
        required: [true, 'phone not provided']
    },
    email: {
        type: String,
        unique: [true, "email already exists in database!"],
        lowercase: true,
        trim: true,
        required: [true, "email not provided"],
        validate: {
        validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        required: true
    },
    created_date: { type: Date, default: Date.now },
})

customerSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  customerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Customer', customerSchema)