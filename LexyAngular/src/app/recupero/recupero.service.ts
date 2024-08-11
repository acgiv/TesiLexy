import { Injectable } from '@angular/core';
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class RecuperoService {
  private apiUrl = 'http://127.0.0.1:5000/';
  constructor(
    private http: HttpClient,

  ) { }

  SendisCheckEmail(body: any): Observable<any> {
   const headers = new HttpHeaders({'Content-Type': 'application/json'});
   return this.http.post<any>(this.apiUrl+'checkEmail', body, {headers});
   }

  SendVerifyEmail(body: any): Observable<any> {
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<any>(this.apiUrl+'sendemail', body, {headers});
   }


  isCheckEmail(newBody: { email: any }): Observable<any> {
   return  this. SendisCheckEmail(newBody)
      .pipe(
        tap( _ => {}),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return of(null);
        })
      )
   }

  sendEmail(newBody: { email: any }): Observable<any> {
     return  this. SendVerifyEmail(newBody)
      .pipe(
        tap( _ => {}),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return of(null);
        })
      )
  }

  SendChangePassword(body: any): Observable<any> {
   const headers = new HttpHeaders({'Content-Type': 'application/json'});
   return this.http.post<any>(this.apiUrl+'/changePassword', body, {headers});
   }


  changePassword(newBody: any): Observable<any> {
   return  this.SendChangePassword(newBody)
      .pipe(
        tap( _ => {}),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return of(null);
        })
      )
   }
}


export interface RecuperoRespost{
    "args": {
        "email":string,
        "found": string,
        "id_utente": number,
        "username": string
    },
    "mimetype": string,
    "status": number
  }

  export interface ChangePaasword{
    data:{
      id: number,
      email: string,
      username: string
      password: string,
    }
  }

  export interface ControlFormError{
    formControl: boolean;
    formSubmitted: boolean;
    error_clone_username: boolean;
    error_form_selected: boolean;
  }

  export interface SendEmailResponse{

    "args": {
        "code": string
      },
      "mimetype": string,
      "status": number
  }

  export interface ConfirmChangePassword{
  "args": {
       "change": boolean
      },
      "mimetype": string,
      "status": number
  }

