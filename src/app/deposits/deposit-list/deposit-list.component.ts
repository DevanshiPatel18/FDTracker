import { Component,  OnDestroy, OnInit } from '@angular/core';
import { Deposit } from '../deposit.model';
import { DepositService } from '../deposit.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
  styleUrls: ['./deposit-list.component.css']
})

export class DepositListComponent implements OnInit,OnDestroy {

  deposits: Deposit[] = [];
  private DepositSub!: Subscription;
  loading = false;
  totalDeposits = 0;
  depositPerPage = 4;
  currentPage = 1;
  pageSizeOption = [1,2,4,8,10,15,20]
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  customerId: string;

  constructor( public depositService: DepositService, private authService : AuthService) {

  }

  ngOnInit() {
    this.loading = true;
    this.depositService.getDeposits(this.depositPerPage,this.currentPage);
    this.customerId = this.authService.getCutomerId();
    this.DepositSub = this.depositService.getDepositUpdateListner()
    .subscribe((depositData :{deposits: Deposit[], depositCount: number}) => {
      this.loading = false;
      this.totalDeposits = depositData.depositCount;
      this.deposits = depositData.deposits;
    });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.customerId = this.authService.getCutomerId();
    });
  }

  onDelete(postId : string){
    this.loading = true;
    this.depositService.deletePost(postId)
    .subscribe(() => {
      this.depositService.getDeposits(this.depositPerPage, this.currentPage)
    });
  }

  onChangedPage(pageData: PageEvent){
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.depositPerPage = pageData.pageSize;
    this.depositService.getDeposits(this.depositPerPage,this.currentPage);
  }

  ngOnDestroy(){
    this.DepositSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
