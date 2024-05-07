import { Injectable } from '@angular/core';

interface Access {
  access: boolean;
  username: string;
  email: string;
  eta: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  access: Access = {
    access: false,
    username: "",
    email: "",
    eta: 0
  }
  constructor() { }

   // Funzione per impostare lo stato di accesso
  setAccessStatus(status: boolean) {
    this.access.access = status;
  }

  // Funzione per impostare il nome utente
  setUsername(username: string) {
    this.access.username = username;
  }

  // Funzione per impostare l'email
  setEmail(email: string) {
    this.access.email = email;
  }

  // Funzione per impostare l'ETA
  setETA(eta: number) {
    this.access.eta = eta;
  }

  resetAccess() {
    this.access = {
      access: false,
      username: "",
      email: "",
      eta: 0
    };
  }
}
