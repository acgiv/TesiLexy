import { Injectable } from '@angular/core';
import {FormInput} from "../form";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

@Injectable({
  providedIn: 'root'
})
export class InputPasswordService {

  showPasswords: { [key: string]: boolean } = {};
  typeText: string;
  constructor() {
     this.typeText =  "password";
  }

   getPasswordType(inputName: string): string {
    return this.showPasswords[inputName] ? "text" : "password";
  }

   setTogglePassword(inputName: string, elem: FormInput) {
    this.showPasswords[inputName] = !this.showPasswords[inputName];
    elem.input.typeText = String(this.getPasswordType(inputName));
    elem.emoji = this.getIcon(inputName);
  }

  getIcon(inputName: string): any {
    return this.showPasswords[inputName] ?faEyeSlash: faEye  ;
  }
}
