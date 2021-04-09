import {Deposit} from '../deposits/deposit.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class DepositService{

  private deposits: Deposit[] = [];
  private depositUpdated = new Subject<{deposits: Deposit[], depositCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getDeposits(pageSize: number, currentPage: number){
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}&dashboard=true`;
    this.http.get<{ message: string, deposits: any, maxDeposits: number}>('/api/deposits'+queryParams)
    .pipe(
      map(depositData => {
        console.log(depositData);
        return {
          deposits: depositData.deposits.map(deposit => {
            //const date = deposit.renewalDate.substring(0,10).split("-");
            return {
            id : deposit._id,
            depositId: deposit.depositId,
            primaryHolder: deposit.primaryHolder,
            secondryHolder: deposit.secondryHolder,
            bank: deposit.bank,
            branch: deposit.branch,
            amount: deposit.amount,
            tenure: deposit.tenure,
            renewalDate: deposit.renewalDate,
            customerId: deposit.customerId,
            interestRate: deposit.interestRate,
            emailId : deposit.emailId
            };
          }),
          maxDeposits : depositData.maxDeposits
        };
      })
   ).subscribe((transformedDepositData) => {
     console.log(transformedDepositData);
      this.deposits = transformedDepositData.deposits;
      console.log(this.deposits);
      this.depositUpdated.next({ deposits : [...this.deposits], depositCount : transformedDepositData.maxDeposits});
    });
  }

  addDeposit(deposit: Deposit){
    this.http.post<{message: string, id : string}>('/api/deposits',deposit)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  getDeposit( id: string){
    return this.http.get<{ message: string, deposit : Deposit, customerId: string}>('/api/deposits/'+id);
  }


  getDepositUpdateListner(){
    return this.depositUpdated.asObservable();
  }

  deletePost(depositId : string){
    console.log("**"+depositId);
     return this.http.delete('/api/deposits/'+depositId)

  }

  updateDeposit(deposit: Deposit){
    //const updatedDeposit: Deposit = {
      //id: deposit.id,
      //primaryHolder: deposit.primaryHolder,
      //secondryHolder: deposit.secondryHolder,
      //bank: deposit.bank,
      //branch: deposit.branch,
      //amount: deposit.amount,
      //tenure: deposit.tenure,
      //renewalDate: deposit.renewalDate
    //};
    console.log(deposit);
    this.http.put('/api/deposits/'+deposit.id,deposit)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }
}
