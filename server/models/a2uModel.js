import mongoose from "mongoose";
var schema = new mongoose.Schema({
    uid: {
        type: String
    
    },
    piName: {
        type: String
    },
    balance : {
        type: Number
    },
    memo:{
        type: String
    },
    paymentId:{
        type: String
    },
    
    txid:{
        type: String
    },
 

}, {
    timestamps: true
})
export const withdrawModel = mongoose.model('withdraw', schema)