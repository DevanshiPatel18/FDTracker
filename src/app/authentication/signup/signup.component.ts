import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignUpComponent implements OnInit {

  loading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() { }

  onSignUp(form : NgForm){
    if(form.invalid){
      return;
    }
    if(form.value.password === form.value.reenterPassword)
      this.authService.createUser(form.value.name, form.value.email, form.value.password)
      this.loading = true;
    }
}
