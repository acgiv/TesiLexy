import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  ChangePaasword,
  RecuperoRespost,
  RecuperoService,
  SendEmailResponse
} from "./recupero.service";
import {sha256} from "js-sha256";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";


import {multiPatternValidator, urlValidator} from "../form/Validator/validator";
import {InputTextComponent} from "../form/input_text/input_text.component";
import {ControlFormDirective} from "../form/control-form.directive";
import {faEye} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-recupero-password',
  standalone: true,
  imports: [
    FaIconComponent,

    FormsModule,
    NgIf,

    ReactiveFormsModule,
    NgClass,
    InputTextComponent,
    NgForOf
  ],
  templateUrl: './recupero-password.component.html',
  styleUrl: './recupero-password.component.css'
})
export class RecuperoPasswordComponent implements OnInit{
     protected formGroup: FormGroup;
     protected submit: boolean= false;
     protected codeMessage : string = "";
     protected rangelist = [0,2];
     private  newBody: ChangePaasword ={
                 data:{
                   id : -1,
                   email:"",
                   username: "",
                   password:""
                 }
               }

  constructor( private router: Router, private fb: FormBuilder, protected formD: ControlFormDirective , private recuperoService: RecuperoService) {
      this.formGroup = this.fb.group({});
      this.formD.form.splice(0, this.formD.form.length);
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
              emailNotFound:"Non è stata trovata nessun'email."
            }
         },
          insertEmoji: false
        },
      {
          label: {
            name: 'Codice Conferma',
            isRequired: true,
            emojiInfo: {
              message: "Inserisci il codice di conferma inviato via email.",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input:{
            class: "form-control pass rounded rounded-1  border  border-dark ",
            typeText: "email",
            name: 'Codice Conferma',
            id: "codiceConferma",
            placeholder: 'Codice Conferma',
            maxLength:6,
            disabled:true,
            validator: [
              Validators.required,
              multiPatternValidator([],
              )
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
              patternEmail:"Indirizzo email non valido. Esempio di formato corretto: esempio@dominio.com.",
              emailExist:"Esiste gia un account con questa email."
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
      this.formGroup= this.formD.setRangeValidator(this.fb,0,2);
    }


  async onRecupero() {
    this.submit = true;
    if ( this.formGroup.valid ){
      if (this.codeMessage.length ===0 && this.newBody.data.email.length ===0 ){
          try {
              await this.checkEmail(this.formGroup.value["E-mail"]);
          } catch (error) {
            console.error(error);
        }
      }else if (this.codeMessage === this.formGroup.value["Codice Conferma"]) {
            this.submit = false;
            this.rangelist = [2,5];
            this.formGroup = this.formD.setCleanValidator(this.formGroup);
            this.formGroup = this.formD.setRangeValidator(this.fb,2,5);
      } else if(this.rangelist[0]!= 0){
        await this.changePassword(this.formGroup.value["Password"], this.newBody.data.email);
        await this.router.navigate([!this.isTerapista()?'/terapista/login':'/login']);
        }
    }
  }


  async checkEmail(email: string) {
   const response: RecuperoRespost = await firstValueFrom(this.recuperoService.isCheckEmail({ email }));
   if (response.args.found == "YES") {
      this.newBody.data.id = response.args.id_utente;
      this.newBody.data.username = response.args.username;
      this.newBody.data.email = response.args.email;
      const response2:  SendEmailResponse = await firstValueFrom(this.recuperoService.sendEmail({ email }));
      if(response2){
        this.formGroup.get("Codice Conferma")?.enable();
         this.formGroup.get("E-mail")?.disable();
        this.codeMessage = response2.args.code;
        this.submit = false;
      }
    } else {
       this.formGroup.get("E-mail")?.setErrors({"emailNotFound":true});
    }
  }

  async changePassword(password: string, email: string) {
    let send = {"email": email, "password": sha256.update(password).hex()}
    await firstValueFrom(this.recuperoService.changePassword(send));
  }

  isTerapista(): boolean {
   const pattern = /\/terapista/; // Definisci il pattern regolare
    return  new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }
}
