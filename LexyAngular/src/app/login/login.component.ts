import {Component, Injectable, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {
  FormsModule,
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms'
import { sha256 } from 'js-sha256';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {multiPatternValidator, urlValidator} from "../form/Validator/validator";
import {LoginService} from "./login.service";
import {catchError, of, tap} from "rxjs";
import {AccessService} from "../access.service";
import {InputTextComponent} from "../form/input_text/input_text.component";
import {ControlFormDirective} from "../form/control-form.directive";
import {faEye} from "@fortawesome/free-solid-svg-icons";

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
    FaIconComponent,
    RouterLinkActive,
    RouterLink,
    ReactiveFormsModule,
    InputTextComponent,
    NgForOf
  ],
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit{
   error: boolean;
   protected formGroup: FormGroup;
   protected submit: boolean= false;

  constructor(private router: Router, private fb: FormBuilder,  protected formD: ControlFormDirective,  private loginService: LoginService,  private accessService:  AccessService) {
    this.error = true;
    this.formD.form.splice(0, this.formD.form.length);
    this.formGroup = this.fb.group({});
  }

 ngOnInit(): void {
    this.formD.form.push(
        {
          label: {
            name: 'Username',
            isRequired: true,
            emojiInfo: {
              message: "Inserisci il tuo username",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input:{
            class: "form-control pass rounded rounded-1  border  border-dark ",
            typeText: "text",
            name: 'Username',
            id: "username",
            placeholder: 'Username',
            validator: [
              Validators.required,
              multiPatternValidator([
              ])
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
            }
         },
          insertEmoji: false
        },{
           label:{
            name:'Password',
            isRequired:true,
            emojiInfo: {
              message: "Inserisci la tua password",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'password',
            name: 'Password',
            id: "password",
            placeholder: 'Password*',
            validator: [
              Validators.required,
              multiPatternValidator([])
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
            },
          },
          insertEmoji: true,
          emoji: faEye,
          positionEmoji: "right",
          isPassword: true
        }
    );
    this.formGroup= this.formD.setAllValidator(this.fb);
  }


  onLogin() {
    this.submit = true;
    if(this.formGroup.valid){
      const username = this.formGroup.value["Username"].toLowerCase();
      const password = sha256.update(this.formGroup.value["Password"]).hex();
      this.loginService.loginPost({ username, password })
        .pipe(
          tap(response => {
            if(response.response.result_connection) {
              this.error = response.response.result_connection;
               this.accessService.insertAccess(response, username, true);
               this.formD.ngOnDestroy()
              if (this.accessService.getRuolo() =="terapista") {
                this.router.navigate(['/terapista'], {
                 state: {navigatedByButton: true}
               }).then(() => {});
              } else {
                this.router.navigate(['/'], {
                 state: {navigatedByButton: true}
               }).then(() => {});
              }
            }else{
                this.error = false;
            }
          }),
          catchError(_ => {
            return of(null);
          })
        )
        .subscribe();
    }

  }

  isTerapista(): boolean {
   const pattern = /\/terapista/; // Definisci il pattern regolare
    return  new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }

  setState(url: string) {
     this.router.navigate([url], {
       state: {navigatedByButton: true}
     }).then(_ =>{} );
  }
}
