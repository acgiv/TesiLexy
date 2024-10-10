import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Riquest} from "../terapista/dashboard/riquest.service";

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  private url = 'http://127.0.0.1:5000/';
  constructor( private http: HttpClient,) {
  }

  find_all_Chat(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/find_all_chat_by_id", body, {headers});
  }

  create_chat(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/create_chat_child", body, {headers});
  }

   update_chat(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/update_chat_child", body, {headers});
  }

  destroy_chat(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/destroy_chat_child", body, {headers});
  }

  find_message_limit_chat(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/find_all_limit_message", body, {headers});
  }

  update_message_versione_corrente(body: any): Observable<any>{
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post<Riquest>(this.url+"bambino/update_message_versione_corrente", body, {headers});
  }

}


export interface ChatList {
  idchat: string;
  titolo: string;
  idbambino: string;
  message?: Message[];
  number_all_message?: number;
}




export interface Message {
  id_messaggio: string;
  index_message:string;
  data_creazione: string;
  testo: [[string, string]];
  tipologia:string;
  versione_messaggio: string;
  versione_corrente: number;
}


