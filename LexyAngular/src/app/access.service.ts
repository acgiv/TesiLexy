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
     this.cookieService.set('eta', "", { path: '/', expires: 7 });
  }

   insertAccess(response: Login, username: string, status: boolean){
    this.cookieService.set('accessStatus', status.toString(), { path: '/', expires: 7 });
    this.cookieService.set('username', username, { path: '/', expires: 7 });
    this.cookieService.set('email', response.email, { path: '/', expires: 7 });
    this.cookieService.set('ruolo', response.ruolo, { path: '/', expires: 7 });
    if(response.eta){
      this.cookieService.set('eta', String(response.eta), { path: '/', expires: 7 });
    }

  }

  getAccess():boolean{
    return this.cookieService.check('accessStatus') ? this.cookieService.get('accessStatus') === 'true' : false;
  }
  getUsername():string {
      return this.cookieService.check('username') ? this.cookieService.get('username') : "";
    }

  getRuolo():string {
    return this.cookieService.check('ruolo') ? this.cookieService.get('ruolo')  : "";
  }

   getEta():number | null {
    return this.cookieService.check('eta') ?Number(this.cookieService.get('eta'))  : null;
  }
}
