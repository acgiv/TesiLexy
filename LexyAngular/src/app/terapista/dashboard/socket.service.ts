import { Injectable } from '@angular/core';
import { Socket, Manager } from 'socket.io-client';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    const manager = new Manager('http://127.0.0.1:5000/terapista/message');
     this.socket = manager.socket('/');
  }

  getMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (data: ElementMessage) => {
        observer.next(data);
      });
    });
  }
}

interface Patologia {
  id_patologia: number;
  nome_patologia: string;
}

interface TerapistaAssociato {
  idbambino: string;
  idterapista: string;
}

export  interface ElementMessage {
  operazione: string; // 'update' o altri valori possibili
  id_bambino: string;
  nome: string;
  cognome: string;
  data_nascita: string; // Formato 'YYYY-MM-DD'
  descrizione: string;
  id_terapista: string;
  controllo_terapista: boolean;
  patologie: Patologia[]; // Array di patologie
  id_utente: string;
  username: string;
  email: string; // Assicurati che il formato email sia corretto
  tipologia: string; // 'bambino' o altri valori
  terapista_associati: { [email: string]: TerapistaAssociato }; // Mappa di terapisti associati
}
