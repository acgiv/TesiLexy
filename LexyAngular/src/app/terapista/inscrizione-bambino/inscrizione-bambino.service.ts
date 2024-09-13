import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpHeaders,HttpClient} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class InscrizioneBambinoService {

  url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://127.0.0.1:5000/terapista/';
  }


  registerChild(body: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<RegisterChild>(this.url +'registerchild', body, {headers});
  }

  registerPathology(): Observable<any> {
      return this.http.get<RequestPathology>(this.url +'pathology_list');
  }

}


export interface RegisterChild{
  nome: string;
  cognome:  string;
  username:  string;
  email: string;
  data: string;
  descrizione: string;
  patologie : string[];
}


export interface RequestPathology {
  response : {
    "status_code": number,
    "response": {
      "pathology": [string]},
    "error":
        {
          "number_error": number,
          "message": [string]
        },
    "completed": boolean
  }
}
