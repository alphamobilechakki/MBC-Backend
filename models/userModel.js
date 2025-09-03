import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
});


const userSchema = new mongoose.Schema({
    mobile : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    addresses : [addressSchema],
     role: {
        type: String,
        default: 'user'
    },
    // ✅ integrate reviews
        reviews: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
          },
        ],
},
{timestamps : true});

const userModel = mongoose.model('User' , userSchema);
export default userModel;