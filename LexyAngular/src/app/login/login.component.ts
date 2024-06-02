import {Component, Injectable} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {NgForm, FormsModule, FormControl, Validators} from '@angular/forms'
import { sha256 } from 'js-sha256';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Router} from "@angular/router";
import {urlValidator} from "../Validator/validator";
import {ViewPasswordService} from "../service/view-password.service";
import {LoginService} from "./login.service";
import {catchError, of, tap} from "rxjs";


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

  constructor(private router: Router, protected viewPasswordService: ViewPasswordService, private loginService: LoginService) {
    this.error = true;
    viewPasswordService.showPasswords["password_login"] = false;
  }

   onLogin(form: NgForm) {

      this.error = false;
      const username = form.value.username.toLowerCase();
      const password = sha256.update(form.value.password).hex();

      this.loginService.loginPost({ username, password })
        .pipe(
          tap(response => {
            if(response.result_connection) {
              this.error = response.result_connection;
              this.loginService.insertAccess(response);
              if (!this.isTerapista()) {
                this.router.navigate(['/terapista']);
              } else {
                this.router.navigate(['/']);
              }
            }else{
               this.error = false;
            }
          }),
          catchError(error => {
            console.error('Errore durante la registrazione:', error);
            return of(null);
          })
        )
        .subscribe();
  }

  isTerapista(): boolean {
   const pattern = /\/terapista/; // Definisci il pattern regolare
    return  new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }
}
