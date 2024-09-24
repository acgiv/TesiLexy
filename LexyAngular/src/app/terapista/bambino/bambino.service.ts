import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpHeaders,HttpClient} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class BambinoService {

  url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://127.0.0.1:5000/terapista/';

  }


  registerChild(body: any): Observable<any> {
   const headers = new HttpHeaders({'Content-Type': 'application/json', 'User-Agent': 'Custom'});
    return this.http.post<RegisterChild>(this.url +'registerchild', body, {headers});
  }

  registerPathology(): Observable<any> {

      return this.http.get<RequestListSelect>(this.url +'pathology_list');
  }

  list_user_therapist(body:any): Observable<any> {
      const headers = new HttpHeaders({'Content-Type': 'application/json', 'User-Agent': 'Custom'});
      return this.http.post<RequestListSelect>(this.url +'all_email', body, {headers});
  }

}


export interface RegisterChild{
  nome: string;
  cognome:  string;
  username:  string;
  email: string;
  data: string;
  descrizione: string | null;
  patologie : string[];
  id_terapista: string;
  controllo_terapista: boolean;
  terapisti_associati: [string] | null;
}


export interface RequestListSelect {
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
