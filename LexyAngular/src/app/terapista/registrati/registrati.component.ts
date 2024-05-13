import {Component, Injectable} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AccessService} from "../../access.service";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {ViewPasswordService} from "../../service/view-password.service";
import {Login} from "../../login/login";

@Component({
  selector: 'app-registrati',
  standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class RegistratiComponent {
  constructor(private router: Router, protected viewPasswordService: ViewPasswordService ) {
    viewPasswordService.showPasswords["password"]= false;
    viewPasswordService.showPasswords["confirm_password"] = false;
  }

}
