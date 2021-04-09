import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog){}

  intercept(req: HttpRequest<any>,next: HttpHandler){
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errormessage = 'An unkown error occured!';
        console.log(error);
        if(error.error.message){
          errormessage = error.error.message;
        }
        const closed = this.dialog.open(ErrorComponent, {data: {message: errormessage}})
        closed.afterClosed().subscribe(result => {
          window.location.reload();
        })
        return throwError(error);

      })
    );
  }
}
