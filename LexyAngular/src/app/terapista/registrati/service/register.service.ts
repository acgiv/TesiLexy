import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Register} from "../register";

@Injectable({
  providedIn: 'root'
})


export class RegisterService {
  value_error_email: boolean;
  value_error_username: boolean;
  value_error_password: boolean;
  value_error_conf_password: boolean;
  value_message_error_email: string;
  value_message_error_username: string;
  value_percent_password: number;
  value_error_clone_username: boolean;
  value_error_clone_email: boolean;

  constructor(private http: HttpClient) {
    this.value_error_email = false;
    this.value_error_username = false;
    this.value_error_password = false;
    this.value_error_conf_password = false;
    this.value_message_error_email = "";
    this.value_message_error_username = "";
    this.value_percent_password = 0;
    this.value_error_clone_username = false;
    this.value_error_clone_email = false;

  }

  set_control_register(value: boolean, type: string | undefined) {
    if (type !== undefined) {
      if (type === "email") {
        this.value_error_email = value;
      } else {
        this.value_error_username = value;
      }
    }
  }

  set_message_register(value: string, type: string | undefined) {
    if (type !== undefined) {
      if (type === "email") {
        this.value_message_error_email = value;
      } else {
        this.value_message_error_username = value;
      }
    }
  }

  set_error_clone_register(value: boolean, type: string | undefined) {
    if (type !== undefined) {
      if (type === "email") {
        this.value_error_clone_email = value;
      } else {
        this.value_error_clone_username = value;
      }
    }
  }

  set_error_clone_register_reset() {
    this.value_error_clone_email = false;
    this.value_error_clone_username = false;
  }

  color_progress() {
    if (this.value_percent_password <= 32) {
      return "red"
    } else if (this.value_percent_password < 64) {
      return "orange"
    } else if (this.value_percent_password < 70) {
      return "lightgreen"
    } else if (this.value_percent_password < 90) {
      return "green"
    } else {
      return 'darkgreen';
    }
  }

  registerPost(body: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Register>('http://127.0.0.1:5000/register', body, {headers});
  }
}
