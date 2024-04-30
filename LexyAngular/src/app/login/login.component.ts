import {Component, Injectable} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from "../header/header.component";
import {NgForm } from '@angular/forms'
import {HttpClient, HttpHeaders} from "@angular/common/http";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
    HeaderComponent,
    NgIf
  ],
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent {
  error: boolean = true;
  private apiUrl = 'http://127.0.0.1:5000/admin/login';
  constructor(private http: HttpClient) {}


  loginPost(body: any){

        const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    this.http.post('http://127.0.0.1:5000/login', body, headers).subscribe((posts:any) =>{
       this.error=posts.result_connection;
    });
  }

   onLogin(form: NgForm) {
    if(form.value.username.length!== 0 && form.value.password!== 0){
      this.loginPost({"username": form.value.username, "password": form.value.password});
    }else{
      this.error= false;
    }


  }
}
