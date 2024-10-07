import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Riquest} from "../dashboard/riquest.service";

@Injectable({
  providedIn: 'root'
})
export class TestoAdattatoService {


  protected url: string;
  protected url_api: string;

  constructor(private http: HttpClient) {
    this.url = 'http://127.0.0.1:5000/terapista/'
    this.url_api = 'http://127.0.0.1:5000/api/'
  }

  set_list_all_user_child(body: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Riquest>(this.url_api+"find_all_user_child_by_therapist", body, {headers});
  }


  insert_text(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"insert_text", body, {headers});
  }

  update_text(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"update_text_adattato", body, {headers});
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
