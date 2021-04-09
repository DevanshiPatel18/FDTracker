var depositModel = require('../models/deposit');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://devanshi:vd9GaxYPnSjFvya6@cluster0.8jifm.mongodb.net/angularDB?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to Database");
})
.catch((error) => {
  console.log("Connection Failed: "+ error);
});

var today = new Date();
var year = today.getFullYear()
var month = today.getMonth() + 1;
var date = today.getDate();
console.log(year+ " "+ month + " "+ date);
if(date <10){
  date = '0' + date;
}
if(month < 10){
  month = '0' + month;
}
var newToday = year + "-" + month + "-" + date;
let transportor = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port : 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'devanshi.18beitg100@gmail.com',
    pass: 'I@mtonystark18'
  }
});

const depositQuery = depositModel.find({renewalDate : {$lte : newToday}})
.then(documents => {
  for (let index = 0; index < documents.length; index++) {
    //console.log(documents[index]);
    //console.log(data);
    console.log('I am here!');
    var mailOptions = {
      from: 'devanshi.18beitg100@gmail.com',
      to: documents[index].emailId,
      subject : 'Reminder for renewal of deposit!',
      html : `
      <h3>Deposit Renewal Date is near.</h3>
          <h5>Dear ${ documents[index].primaryHolder}</h5>
          <article>
            Your Depsoit with the following details has come due to it's renewal date. Kindly do the needful.
            The following are the details of the deposit:
            <ul>
              <li>Depsit Id : ${ documents[index].depositId}</li>
              <li>primary Holder: ${ documents[index].primaryHolder }</li>
              <li>Secondry Holder: ${ documents[index].secondryHolder}</li>
              <li>Bank: ${ documents[index].bank}</li>
              <li>Branch: ${ documents[index].branch}</li>
              <li>Amount: ${ documents[index].amount}</li>
              <li>Renewal Date: ${ documents[index].renewalDate }</li>
            </ul>
          </article>`
    };
    console.log('I am here 2');
    transportor.sendMail(mailOptions, function(error, data){
      if(error){
        console.log(error);
      }else{
        console.log('Email sent: '+ data.response);
      }
    })

  };
}).catch(error => {
  console.log(error);
})


