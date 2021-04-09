import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { Deposit } from './deposits/deposit.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FDTracker';

  constructor(private authService: AuthService){

  }

  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
