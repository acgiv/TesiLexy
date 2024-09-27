import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class RiquestService {

  protected url: string;

  RiquestChild(body: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Riquest>(this.url+"find_child_therapist", body, {headers});

  }

  constructor(private http: HttpClient) {
    this.url = 'http://127.0.0.1:5000/terapista/'

  }



}


export interface Riquest {
   "status_code": number,
    "response": RiquestChildDahboard,
    "error":
        {
            "number_error": number,
            "message": []
        },
    "completed": boolean
}

export interface RiquestChildDahboard {
   "status_code": number,
    "response": {"list_child":[Bambino]},
    "error":
        {
            "number_error": number,
            "message": []
        },
    "completed": boolean
}

export interface Bambino {
   "id_bambino": string,
    "nome": string,
    "cognome": string,
    "data_nascita": string,
    "descrizione": string,
    "id_terapista": string,
    "controllo_terapista": number,
    "patologie": [],
    "id_utente": string,
    "username": string,
    "email": string,
    "tipologia": string,
    "terapista_associati": string[]
}
