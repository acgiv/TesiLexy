import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";
import {AccessService} from "../access.service";
import {Login} from "./login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private accessService: AccessService) {}

  loginPost(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Login>('http://127.0.0.1:5000/login', body, { headers });
  }



}
