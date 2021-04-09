const express = require('express');
const depositModel = require('../models/deposit');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('',checkAuth, (req,res,next) => {
  const deposit = new depositModel({
    depositId: req.body.depositId,
    primaryHolder : req.body.primaryHolder,
    secondryHolder : req.body.secondryHolder,
    bank : req.body.bank,
    branch : req.body.branch,
    amount: req.body.amount,
    tenure: req.body.tenure,
    renewalDate: req.body.renewalDate,
    customerId: req.userData.userId,
    interestRate: req.body.interestRate,
    emailId : req.userData.email
  });
  deposit.save().then(result => {
    console.log(result._id);
    res.status(201).json({
      message: 'Deposit added Successfully !',
      id : result._id
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a Deposit Failed. Please try again.'
    })
  });
});

router.get('/:id', (req,res,next) => {
  depositModel.findById(req.params.id)
  .then(deposit => {
    if(deposit){
      res.status(200).json({message : "deposit found", deposit : deposit});
    }else{
      res.status(484).json({message: 'Deposit not Found'});
    }
  });
})


router.get('',checkAuth,(req, res, next) => {
  let condition = req.query.condition;
  if(req.query.dashboard === 'true'){
  const PageSize = +req.query.pageSize;
  const CurrentPage = +req.query.currentPage;
  const depositQuery =  depositModel.find({customerId: req.userData.userId});
  if(PageSize && CurrentPage){
    depositQuery.skip(PageSize * (CurrentPage - 1))
    .limit(PageSize);
  }
  let docs;
  depositQuery
  .then((documents) => {
    console.log(documents);
    docs = documents;
    return depositModel.countDocuments();
  })
  .then((count) => {
    console.log(docs);
    res.status(200).json({
      message: 'Deposits fetched successfully',
      deposits: docs,
      maxDeposits: count
    })
  })
}else{
  depositModel.find().where({condition}).then(result => {
    res.status(200).json({
      message: 'depsoits found!',
      deposit: result
    })
  }).catch(eror => {
    res.status(401).json({
      message: 'could not get the deposits!'
    })
  })
}
});

router.delete('/:id',checkAuth, (req,res,next) => {
  depositModel.deleteOne({ _id : req.params.id, customerId: req.userData.userId})
  .then(result => {
    console.log(result);
    if(result.deletedCount > 0){
      res.status(200).json({
        message: 'Deletion Successful'
      })

    }else{
      res.status(401).json({message: 'Delete Failed! Please try again.'});
    }
  });
});

router.put('/:id',checkAuth, (req,res,next) => {
  console.log(req.body.renewalDate);
  const deposit = new depositModel({
    _id : req.params.id,
    depositId: req.body.depositId,
    primaryHolder: req.body.primaryHolder,
    secondryHolder: req.body.secondryHolder,
    bank: req.body.bank,
    branch: req.body.branch,
    amount: req.body.amount,
    tenure: req.body.tenure,
    renewalDate: req.body.renewalDate,
    customerId: req.userData.userId,
    interestRate: req.body.interestRate,
    emailId: req.userData.email
  });
  console.log(deposit);
  depositModel.updateOne({_id: req.params.id,customerId: req.userData.userId}, deposit)
  .then(result =>{
    if(result.nModified > 0){
    res.status(200).json({
      message: 'Update Successful'
    })
  }else{
    res.status(401).json({message: 'Update Failed! Please try again.'});
  }
  }).catch(error => {
    console.log(error);
  });
})

module.exports = router;
