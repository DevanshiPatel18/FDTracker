const mongoose = require('mongoose');


const depositSchema = mongoose.Schema({

  id: {type: String},
  customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  depositId: {type: String, required: true, default: ""},
  primaryHolder: {type: String, required: true, default: ""},
  secondryHolder: {type: String, required: true, default: ""},
  bank: {type: String, required: true, default: ""},
  branch: {type: String, required: true, defualt: ""},
  amount: {type: Number, required: true, default: 0},
  tenure: {type: Number, required: true, default: 0},
  renewalDate: {type: String, required: true, default: ""},
  interestRate: {type: Number, required:true, default: 0},
  emailId : {type: String, required: true, default: ""}
});

module.exports = mongoose.model('Deposit',depositSchema);

