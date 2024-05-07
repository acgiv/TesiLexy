import {Component, Injectable} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {NgForm, FormsModule, FormControl, Validators} from '@angular/forms'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { sha256 } from 'js-sha256';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Login} from "./login";
import {Router} from "@angular/router";
import {urlValidator} from "../Validator/validator";
import {AccessService} from "../access.service";


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

  constructor(private http: HttpClient,private router: Router, private accessService: AccessService) {
    this.showPassword = true;
    this.typeText =  "password";
    this.error = true;
    this.eye_view = faEye;
  }


  loginPost(body: any){

        const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    this.http.post<Login>('http://127.0.0.1:5000/login', body, headers).subscribe((posts:any) =>{
       if(posts.result_connection) {
         console.log(posts);
         this.error = posts.result_connection;
         this.accessService.setAccessStatus(posts.result_connection);
         this.accessService.setUsername(posts.username);
         this.accessService.setEmail(posts.email);
         this.accessService.setETA(posts.eta);
         if(!this.isTerapista()){
           this.router.navigate(['/terapista']);
         }else{
            this.router.navigate(['/']);
         }

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

  isTerapista(): boolean {
   const pattern = /\/terapista/; // Definisci il pattern regolare
    return  new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }


}
