import mongoose from "mongoose";
var schema = new mongoose.Schema({
    user: {
        type: String
    
    },
    
    balance : {
        type: Number
    },
    paymentId:{
        type: String
    },
    
    txid:{
        type: String
    },
    paid: {
        type: Boolean
    },
    cancelled: {
        type: Boolean
    }

}, {
    timestamps: true
})
export const paymentModel = mongoose.model('payment', schema)