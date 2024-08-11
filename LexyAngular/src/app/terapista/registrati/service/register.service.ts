import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Register} from "../register";

@Injectable({
  providedIn: 'root'
})


export class RegisterService {

  constructor(private http: HttpClient) {
  }

  registerPost(body: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Register>('http://127.0.0.1:5000/register', body, {headers});
  }
}
