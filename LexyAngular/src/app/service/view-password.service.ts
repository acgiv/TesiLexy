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
    this.eye_view = faEye;
  }
    getPasswordType(inputName: string) {
    return this.showPasswords[inputName] ? "text" : "password";
  }

    togglePasswordVisibility(inputName: string) {
    this.showPasswords[inputName] = !this.showPasswords[inputName];
    this.eye_view = this.showPasswords[inputName] ? faEye : faEyeSlash;
  }

}
