import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { LoginComponent } from './authentication/login/login.component';
import { SignUpComponent } from './authentication/signup/signup.component';
import { DepositCreateComponent } from './deposits/deposit-create/deposit-create.component';
import { DepositListComponent } from './deposits/deposit-list/deposit-list.component';

const routes: Routes = [
  {path: 'dashboard', component: DepositListComponent,canActivate: [AuthGuard]},
  {path: 'create', component: DepositCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:depositId', component: DepositCreateComponent, canActivate: [AuthGuard]},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
