const mongoose = require('mongoose');

// Define the address sub-document schema
const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    zipCode: {
        type: String,
        required: [true, 'Zip code is required']
    },

}, { _id: false });

const userSchema = new mongoose.Schema({
	username:{
		type:String,
		trim:true,
		unique:true, 
		required:[true, 'Username is required']
	},

	email:{
		type:String,
		required:[true, 'Email is required'],
        lowercase:true,
		unique: true
	},

    password:{
		type:String,
		required:[true, 'Password is required'],
		minlength:[6, 'Too short password !'],
        select:false
	},

	phone: {
        type: String,
        required: false
    },
	
	avatar:{
        type:String,
        default:'https://img.icons8.com/?size=100&id=fUUEbUbXhzOA&format=png&color=000000'
    },
	
	role:{
		type:String,
		enum:['admin','costumer'],
		default:'costumer'

	},

    addresses: [addressSchema],

    wishList:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Product'
	},

	isVerified:{
		type:Boolean,
		default:false
	},

    resetPasswordToken:{
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    }
	
	
}, {timestamps:true})



const User = mongoose.model('User', userSchema);

module.exports = User