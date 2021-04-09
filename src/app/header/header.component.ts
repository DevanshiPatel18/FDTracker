import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authSerice: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authSerice.getAuthStatus();
    this.authListenerSubs = this.authSerice.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogOut(){
    this.authSerice.logOut();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
