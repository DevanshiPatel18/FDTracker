import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: '',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loading = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    const authorizedUser = this.authService.getAuthStatus();
    if(authorizedUser){
      this.router.navigate(['/dashboard']);
  }
   }

  onLogin(form : NgForm){
    if(form.invalid){
      return;
    }
    this.loading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
