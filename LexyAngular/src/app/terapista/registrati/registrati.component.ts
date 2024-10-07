import {Component, Injectable, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";


import {RegisterService} from "./service/register.service";
import {sha256} from "js-sha256";
import {catchError, of, tap} from "rxjs";
import { RegisterBody} from "./register";
import {AccessService} from "../../access.service";
import {Router} from "@angular/router";
import {InputTextComponent} from "../../form/input_text/input_text.component";
import {ControlFormDirective} from "../../form/control-form.directive";
import {multiPatternValidator} from "../../form/Validator/validator";
import {faEye} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-registrati',
  standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        JsonPipe,
        NgClass,

        InputTextComponent,
        NgForOf
    ],
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class RegistratiComponent implements OnInit{
  formSubmitted: boolean;

  protected formGroup: FormGroup;
  protected submit: boolean= false;


  constructor( private router: Router,private fb: FormBuilder,  protected formD: ControlFormDirective ,protected registerService: RegisterService,   private accessService:  AccessService) {

    this.formGroup = this.fb.group({});
    this.formD.form.splice(0, this.formD.form.length);
    this.formSubmitted = false;
  }

  ngOnInit(): void {
    this.formD.form.push(
        {
          label: {
            name: 'E-mail',
            isRequired: true,
            emojiInfo: {
              message: "Inserisci una email con questo formato: esempio@dominio.com",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input:{
            class: "form-control pass rounded rounded-1  border  border-dark ",
            typeText: "email",
            name: 'E-mail',
            id: "email",
            placeholder: 'E-mail',
            validator: [
              Validators.required,
              multiPatternValidator([
                  {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, errorKey: 'patternEmail'},

              ])
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
              patternEmail:"Indirizzo email non valido. Esempio di formato corretto: esempio@dominio.com.",
              emailExist:"Esiste gia un account con questa email."
            }
         },
          insertEmoji: false
        },
       {
          label: {
            name: 'Username',
            isRequired: true,
            emojiInfo: {
              message: "Inserisci l'username con questo formato: e.esempio1",
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
                {pattern: /^[a-z]\.[a-z]+[1-9]+$/, errorKey:"patternUsername"}
              ])
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
              patternUsername:'Username non valido. Esempio di formato corretto: e.esempio1.',
              usernameExist:"Esiste gia un account con questo Username."
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
              multiPatternValidator([
                 {pattern: /^.{8,}$/, errorKey:"patternPassword"}
              ])
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              patternPassword:"La password deve lunga almeno 8 caratteri"
            },
            passwordBar:true,
          },
          insertEmoji: true,
          emoji: faEye,
          positionEmoji: "right",
          isPassword: true
        },{
           label:{
            name:'Conferma Password',
            isRequired:true,
            emojiInfo: {
              message: "Inserisci di nuovo la password",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'password',
            name: 'Conferma password',
            id: "onfermaPassword",
            placeholder: 'Conferma Password*',
            validator: [
              Validators.required,
              multiPatternValidator([
              ])
            ],
            dependency:{
              nomeInput:"Password",
              typeControl:"equals",
              keyError:"errorConfermaPassword"
            },
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              errorConfermaPassword:"Le password non coincidono"
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


  onRegister() {
    const newBody: RegisterBody = {
      username: String(this.formGroup.value["Username"]).toLowerCase(),
      email:  String(this.formGroup.value["E-mail"]).toLowerCase(),
      password: sha256.update(this.formGroup.value["Password"]).hex()
    };
    this.registerService.registerPost(newBody)
      .pipe(
        tap(response => {
          if (response.completed) {
             this.accessService.insertAccess(response,this.formGroup.value["Username"], true);
             this.router.navigate(['/terapista'], {state: {navigatedByButton: true}}).then(() => {});
             this.formD.ngOnDestroy()
          } else {
            console.log(response);
            for (let i = 0; i < response.error.number_error  ;i++) {
              let keys = Object.keys(response.error.message[i])[0];
              this.set_error_clone_register(keys);
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

    newRegister() {
    this.submit = true;
     if(this.formGroup.valid){
      this.onRegister();
    }

  }

  set_error_clone_register( keys: string ) {
      if (keys === "email") {
        this.formGroup.get("E-mail")?.setErrors({"emailExist":true});
      } else {
        this.formGroup.get(["Username"])?.setErrors({"usernameExist":true});
      }
  }


}
