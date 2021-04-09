import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService{
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private customerId:string;
  private emailId: string;

  constructor(private http: HttpClient, private router: Router){}

  createUser(name: string, email: string, password: string){
    const authData: AuthData = { name: name, email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  getUser(id: string){
    return this.http.get('http://localhost:3000/api/user/'+id);
  }

  getToken(){
    return this.token;
  }

  loginUser(email: string, password: string){
    const authData = {email:email, password: password};
    this.http.post<{token: string, expiresIn: number, customerId: string, emailId: string}>('http://localhost:3000/api/user/login',authData)
    .subscribe(response => {
      console.log(response);
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.customerId = response.customerId;
        this.emailId = response.emailId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
        this.saveAuthData(token, expirationDate, this.customerId);
        this.router.navigate(['/dashboard']);
      }
    });
 }
getEmailId(){
  return this.emailId;
}
getCutomerId(){
  return this.customerId;
}

 getAuthStatusListener(){
   return this.authStatusListener.asObservable();
 }

 getAuthStatus(){
   return this.isAuthenticated;
 }

 logOut(){
   this.token = null;
   this.isAuthenticated = false;
   this.authStatusListener.next(false);
   this.customerId = null;
   this.router.navigate(['/']);
   this.clearAuthData();
   clearTimeout(this.tokenTimer);
 }

 private saveAuthData(token: string, expirationDate: Date, customerId :string){
  localStorage.setItem('token',token);
  localStorage.setItem('expiration', expirationDate.toISOString());
  localStorage.setItem('customerId', customerId);
 }

 private clearAuthData(){
   localStorage.removeItem('token');
   localStorage.removeItem('expiration');
   localStorage.removeItem('customerId');
 }
 autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation)
      return
    const now = new Date();
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresInDuration > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.customerId = authInformation.customerId;
      this.setAuthTimer(expiresInDuration/1000);
      this.authStatusListener.next(true);
    }
 }
 private getAuthData(){
   const token = localStorage.getItem('token');
   const expirationDate = localStorage.getItem('expiration');
   const customerId = localStorage.getItem('customerId');
   if(  !token || !expirationDate){
      return "";
   }
  return {
    token: token,
    expirationDate: new Date(expirationDate),
    customerId: customerId
  }
 }

 private setAuthTimer(duration: number){
   this.tokenTimer = setTimeout(() => {
     this.logOut();
   }, duration*1000);
 }
}
