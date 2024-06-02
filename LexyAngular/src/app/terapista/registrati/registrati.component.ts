import {Component, Injectable} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgIf} from "@angular/common";
import {ViewPasswordService} from "../../service/view-password.service";
import {FormControlDirective} from "./directive/form-control.directive";
import {PasswordControlDirective} from "./directive/password-control.directive";
import {RegisterService} from "./service/register.service";
import {sha256} from "js-sha256";
import {catchError, of, tap} from "rxjs";
import {RegisterBody} from "./register";


@Component({
  selector: 'app-registrati',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    FormControlDirective,
    JsonPipe,
    NgClass,
    PasswordControlDirective
  ],
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class RegistratiComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  formSubmitted: boolean;
  error_clone_username: boolean;


  constructor(protected viewPasswordService: ViewPasswordService, protected registerService: RegisterService) {
    viewPasswordService.showPasswords["password-register"] = false;
    viewPasswordService.showPasswords["confirm_password"] = false;
    this.formSubmitted = false;
    this.error_clone_username = false;
  }


  onRegister(form: NgForm) {

    const newBody: RegisterBody = {
      username: form.value.username.toLowerCase(),
      email: form.value.email.toLowerCase(),
      password: sha256.update(form.value.password).hex()
    };

    this.registerService.registerPost(newBody)
      .pipe(
        tap(response => {
          this.registerService.set_error_clone_register_reset();
          if (response.completed) {
            console.log(response)
          } else {
            console.log(response.error);
            for (let i = 0; i < response.error.number_error; i++) {
              let keys = Object.keys(response.error.message[i])[0];
              console.log(response.error.message[i][keys]);
              this.registerService.set_control_register(true, Object.keys(response.error.message[i])[0]);
              this.registerService.set_message_register(response.error.message[i][keys], keys);
              this.registerService.set_error_clone_register(true, keys);
            }
          }
        }),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  newRegister(form_register: NgForm) {
    this.formSubmitted = true;
    console.log(form_register);
    if (form_register.valid) {
      this.onRegister(form_register);
    }

  }



}
