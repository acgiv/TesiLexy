import { Injectable } from '@angular/core';
import {Login} from "./login/login";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AccessService {
   constructor(private cookieService: CookieService) { }

  resetAccess() {
    this.cookieService.set('accessStatus', false.toString(), { path: '/', expires: 7 });
    this.cookieService.set('username',"", { path: '/', expires: 7 });
    this.cookieService.set('email',"", { path: '/', expires: 7 });
    this.cookieService.set('ruolo', "", { path: '/', expires: 7 });
    this.cookieService.set('id','', { path: '/', expires: 7 });
    this.cookieService.set('id','', { path: '/', expires: 7 });
    this.cookieService.set('valuta','', { path: '/', expires: 7 });
    this.cookieService.set('conta_testi_Associati','', { path: '/', expires: 7 });
  }

   insertAccess(response: Login, username: string, status: boolean){
    this.cookieService.set('accessStatus', status.toString(), { path: '/', expires: 7 });
    this.cookieService.set('username', username, { path: '/', expires: 7 });
    this.cookieService.set('email', response.response.email, { path: '/', expires: 7 });
    this.cookieService.set('ruolo', response.response.ruolo, { path: '/', expires: 7 });
    this.cookieService.set('id',response.response.id_utente, { path: '/', expires: 7 });
    if (response.response.ruolo=='bambino'){
      this.cookieService.set('valuta',response.response.valuta? response.response.valuta: 'true', { path: '/', expires: 7 });
      this.cookieService.set('conta_testi_Associati',response.response.conta_testi_Associati?response.response.conta_testi_Associati :"0", { path: '/', expires: 7 });
    }


  }

  getAccess():boolean{
    return this.cookieService.check('accessStatus') ? this.cookieService.get('accessStatus') === 'true' : false;
  }
  getUsername():string {
      return this.cookieService.check('username') ? this.cookieService.get('username') : "";
    }

  getId():string {
      return this.cookieService.check('id') ? this.cookieService.get('id') : "";
    }

  getEmail():string {
      return this.cookieService.check('email') ? this.cookieService.get('email') : "";
    }

  getRuolo():string {
    return this.cookieService.check('ruolo') ? this.cookieService.get('ruolo')  : "";
  }


   getValuta():string {
    return this.cookieService.check('valuta') ? this.cookieService.get('valuta')  : "";
  }

  getContaTestiAssociati():string {
    return this.cookieService.check('conta_testi_Associati') ? this.cookieService.get('conta_testi_Associati')  : "";
  }

}
