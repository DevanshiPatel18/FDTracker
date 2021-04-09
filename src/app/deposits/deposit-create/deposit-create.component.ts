import { Component,  OnInit} from '@angular/core';
import {Deposit} from '../deposit.model';
import {NgForm} from '@angular/forms';
import {DepositService} from '../deposit.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { from } from 'rxjs';
import {AuthService} from '../../authentication/auth.service';

@Component({
  selector: 'app-deposit-create',
  templateUrl: './deposit-create.component.html',
  styleUrls : ['./deposit-create.component.css']
})

export class DepositCreateComponent implements OnInit {
  constructor(public depositsService: DepositService, public route: ActivatedRoute, private authService : AuthService) { }

  private mode = 'create'
  private depositId: string;
  deposit;
  loading = false;
  private customerId = this.authService.getCutomerId();
  private emailId = this.authService.getEmailId();
  ngOnInit() {
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if(paramMap.has('depositId')){
        this.mode = 'edit';
        this.depositId = paramMap.get('depositId');
        this.loading = true;
        this.depositsService.getDeposit(this.depositId)
        .subscribe(depositData => {
          this.loading = false;
          //const date = depositData.deposit.renewalDate.substring(0,10).split("-");
          this.deposit = {
            id : this.depositId,
            depositId : depositData.deposit.depositId,
            primaryHolder: depositData.deposit.primaryHolder,
            secondryHolder: depositData.deposit.secondryHolder,
            amount: depositData.deposit.amount,
            bank: depositData.deposit.bank,
            branch: depositData.deposit.branch,
            tenure: depositData.deposit.tenure,
            renewalDate: depositData.deposit.renewalDate,
            customerId: depositData.deposit.customerId,
            interestRate: depositData.deposit.interestRate,
            emailId : depositData.deposit.emailId
          }
        });
      }else{
        this.mode = 'create';
        this.depositId = null;
      }
    });
   }

  enteredDate: Date = new Date();

  onAddDeposit(form: NgForm){
    if(form.invalid){
      return;
    }
    this.loading = true;
    if(this.mode === 'create'){
      //const date = form.value.date.split('-');
      //console.log("%%%%%%%%%%%%%%%%55");
      //console.log(date);
      const deposit: Deposit = {
        id: "",
        depositId: form.value.depositId,
        primaryHolder: form.value.primaryHolder,
        secondryHolder: form.value.secondryHolder,
        bank: form.value.bank,
        branch: form.value.branch,
        amount: form.value.amount,
        tenure: form.value.tenure,
        renewalDate: form.value.date,
        customerId: this.customerId,
        interestRate: form.value.interestRate,
        emailId : this.emailId
     }
     console.log(deposit.renewalDate);
     this.depositsService.addDeposit(deposit);
    }else{
      const date = form.value.date.split('-');
      const newDeposit: Deposit = {
        id: this.depositId,
        depositId: form.value.depositId,
        primaryHolder: form.value.primaryHolder,
        secondryHolder: form.value.secondryHolder,
        bank: form.value.bank,
        branch: form.value.branch,
        amount: form.value.amount,
        tenure: form.value.tenure,
        renewalDate:  form.value.date,
        customerId: this.customerId,
        interestRate: form.value.interestRate,
        emailId: this.emailId
      }

      this.depositsService.updateDeposit(newDeposit);
    }

    form.resetForm();
  }
}
