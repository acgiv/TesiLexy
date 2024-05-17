import { Injectable } from '@angular/core';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

@Injectable({
  providedIn: 'root'
})
export class ViewPasswordService {
  eye_view: any;
  showPasswords: { [key: string]: boolean } = {};
  typeText: string;

  constructor() {
    this.typeText =  "password";
  }
    getPasswordType(inputName: string) {
    return this.showPasswords[inputName] ? "text" : "password";
  }

    togglePasswordVisibility(inputName: string) {
    this.showPasswords[inputName] = !this.showPasswords[inputName];
  }

  getIcon(inputName: string): any {
    return this.showPasswords[inputName] ?faEyeSlash: faEye  ;
  }



}
