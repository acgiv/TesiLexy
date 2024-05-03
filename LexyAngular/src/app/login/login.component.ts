import {Component, Injectable} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from "../header/header.component";
import {NgForm } from '@angular/forms'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { sha256 } from 'js-sha256';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
    HeaderComponent,
    NgIf,
    FaIconComponent
  ],
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent {
  error: boolean;
  eye_view: any;
  showPassword: boolean;
  typeText: string;

  constructor(private http: HttpClient) {
    this.showPassword = true;
    this.typeText =  "password";
    this.error = true;
    this.eye_view = faEye;
  }


  loginPost(body: any){

        const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    this.http.post('http://127.0.0.1:5000/login', body, headers).subscribe((posts:any) =>{
       if(posts.result_connection) {
         this.error = posts.result_connection;
       }else{
         this.error = false;
       }
    });
  }

   onLogin(form: NgForm) {
    if(form.value.username.length != 0 && form.value.password != 0){
      this.loginPost({"username": form.value.username.toLowerCase(), "password": sha256.update(form.value.password).hex()});
    }else{
      this.error= false;
    }
  }

  togglePasswordVisibility() {
    if(!this.showPassword){
      this.showPassword = true;
      this.typeText = "password";
      this.eye_view = faEye;
    }else{
      this.showPassword = false;
      this.typeText = "text";
      this.eye_view = faEyeSlash;
    }
  }

}
