import {Component, Injectable} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgIf} from "@angular/common";
import {ViewPasswordService} from "../../service/view-password.service";
import {FormControlDirective} from "./directive/form-control.directive";
import {PasswordControlDirective} from "./directive/password-control.directive";


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
  email :string ='';
  username :string ='';
  password: string ='';

  constructor( protected viewPasswordService: ViewPasswordService ) {
    viewPasswordService.showPasswords["password"]= false;
    viewPasswordService.showPasswords["confirm_password"] = false;
  }

  newRegister(form_register: NgForm) {
    console.log(form_register.value.email);



  }



}
