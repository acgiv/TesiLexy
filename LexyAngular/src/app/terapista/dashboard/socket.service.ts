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
   sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  getMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (data) => { // Assicurati che 'message' corrisponda a quello che hai usato nel server
        observer.next(data);
      });
    });
  }
}
