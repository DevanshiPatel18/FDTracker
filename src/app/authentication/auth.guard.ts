import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authSerice: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    const isAuth = this.authSerice.getAuthStatus();
    if(!isAuth){
      this.router.navigate(['/']);
    }
    return isAuth;
  }
}
