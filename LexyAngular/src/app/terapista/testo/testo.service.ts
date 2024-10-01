import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Riquest} from "../dashboard/riquest.service";

@Injectable({
  providedIn: 'root'
})
export class TestoService {


  protected url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://127.0.0.1:5000/terapista/'

  }

  find_all_materia(): Observable<any> {
    return this.http.get<Riquest>(this.url+"lista_materia_testo");
  }

  insert_text(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"insert_text", body, {headers});
  }

  update_text(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"update_text", body, {headers});
  }



}

export interface Testo {
  eta_riferimento: number;
  id_terapista?: string;
  id_testo: number;
  tipologia_testo: string;
  testo: string;
  tipologia?: string;
  titolo: string;
}
