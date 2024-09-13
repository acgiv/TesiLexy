import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule, Validators
} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ControlFormDirective} from "../../form/control-form.directive";
import {InputTextComponent} from "../../form/input_text/input_text.component";
import {multiPatternValidator, multiPatternValidatorSelect} from "../../form/Validator/validator";
import {InputSelectComponent} from "../../form/input-select/input-select.component";
import {catchError, of, tap} from "rxjs";
import {InscrizioneBambinoService, RegisterChild} from "./inscrizione-bambino.service";


@Component({
  selector: 'app-inscrizione-bambino',
  standalone: true,
  imports: [
    FormsModule,
    FaIconComponent,
    NgClass,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    InputTextComponent,
    InputSelectComponent
  ],
  templateUrl: './inscrizione-bambino.component.html',
  styleUrl: './inscrizione-bambino.component.css'
})
export class InscrizioneBambinoComponent  implements OnInit, OnDestroy {

  formGroup: FormGroup;
  protected submit: boolean= false;
  list_pathology: string[] = [];


  constructor( private fb: FormBuilder, protected formD: ControlFormDirective,
               private InscrizioneBambinoService : InscrizioneBambinoService) {
    this.formGroup = this.fb.group({});
    if (this.formD.form.length === 0) {
      this.formD.form.push(
        {
          label: {
            name: 'Nome',
            isRequired: true
          },
          input: {
            class: "form-control pass rounded rounded-1  border  border-dark ",
            style: "background-image: none;",
            typeText: "text",
            name: 'Nome',
            id: "Nome",
            placeholder: 'Nome',
            validator: [
              Validators.required,
              multiPatternValidator([
                {pattern: /^[a-zA-Z]{3,}$/, errorKey: 'patternNome'},
              ])
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
              patternNome: 'Il nome deve essere lungo almeno 3 caratteri.',
              nomeEsistente: "Esiste gia un utente con questo nome"
            },
          },
          insertEmoji: false
        }, {
          label: {
            name: 'Username',
            isRequired: true
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'text',
            name: 'Username',
            id: "Username",
            placeholder: 'Username*',
            validator: [
              Validators.required,
              multiPatternValidator([
                {pattern: /^[a-z]\.[a-z]+[1-9]$/, errorKey: 'patternUsername'},
              ])
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              patternUsername: "L'username non è nel formato corretto. Deve essere strutturato come 'e.esempio1'",
            },
          },
          insertEmoji: false
        }, {
          label: {
            name: 'Data',
            isRequired: true
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'date',
            name: 'Data',
            id: "data",
            placeholder: 'data',
            validator: [
              Validators.required,
              multiPatternValidator([
                {pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, errorKey: 'patterndata'},
              ])
            ],
            errorMessages: {
              required: 'Questo campo Data è obbligatorio',
              patterndata: "Il formato della data deve essere dd/mm/aaaa. Assicurati di seguire questo formato esatto.",
            },
          },
          insertEmoji: false,
        }, {
          label: {
            name: 'Cognome',
            isRequired: true
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'text',
            name: 'Cognome',
            id: "Cognome",
            placeholder: 'Congome*',
            validator: [
              Validators.required,
              multiPatternValidator([
                {pattern: /^[a-zA-Z]{3,}$/, errorKey: 'patternCognome'},
              ])
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              patternCognome: 'Il Congome deve essere lungo almeno 3 caratteri.',
            },
          },
          insertEmoji: false,
        }, {
          label: {
            name: 'Email',
            isRequired: true
          },
          input: {
            class: "form-control border border-1 border-dark rounded",
            typeText: 'text',
            name: 'Email',
            id: "Email",
            placeholder: 'E-mail*',
            validator: [
              Validators.required,
              multiPatternValidator([
                {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, errorKey: 'patternEmail'},
              ])
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              patternEmail: 'Indirizzo email non valido. Esempio di formato corretto: esempio@dominio.com.',
            },
          },
          insertEmoji: false,
        },

        {
          tipeInput: "Select",
          label: {
            name: 'Patologie',
            isRequired: true
          },
          input: {
            class: "btn bg-white border border-1 w-100 text-start",
            typeText: 'button',
            id: "Patologie",
            name:"Patologie",
            placeholder: 'Patologie',
            validator: [
              multiPatternValidatorSelect('Patologie', "required")
            ],
            errorMessages: {
              required: 'Questo campo è obbligatorio',
              patternEmail: 'Indirizzo email non valido. Esempio di formato corretto: esempio@dominio.com.',
            },
          },
          insertEmoji: false,
        }
      );
    }
  }
  ngOnInit(): void {

    this.InscrizioneBambinoService.registerPathology().subscribe(data => {
      this.list_pathology = data['args']['response']['pathology'];
      console.log('Dati caricati:', this.list_pathology);
    });

    const formControls = this.formD.form.reduce((acc:{ [key: string]: any[] }, curr) => {
      if(curr.tipeInput && curr.tipeInput=== "Select"){
        acc[curr.input.name] = [[curr.input.placeholder], curr.input.validator];
        acc['search'+curr.input.name]=[''];
      }  else{
        acc[curr.input.name] = ['', curr.input.validator];
      }
      return acc;
    }, {});
    formControls["Descrizione"] = [''];

    this.formGroup= this.fb.group(formControls);
  }

  ngOnDestroy(): void {
    this.formD.form.length = 0;
  }

  createBambino(form : FormGroupDirective ) {
   this.submit = true;
   console.log( String(this.formGroup.value["Nome"]));
   console.log(String(this.formGroup.value["Cognome"]));
   console.log(String(this.formGroup.value["Username"]));
   console.log(String(this.formGroup.value["Email"]));
   console.log(String(this.formGroup.value["Data"]));
   console.log(String(this.formGroup.value["Descrizione"]));
   console.log((this.formGroup.value["Patologie"]).join(","));
   console.log(Object.keys(this.formGroup.controls));

   if(this.formGroup.valid){

    const newBody:  RegisterChild= {
      nome: String(this.formGroup.value["Nome"]),
      cognome:  String(this.formGroup.value["Cognome"]),
      username:  String(this.formGroup.value["Username"]),
      email:  String(this.formGroup.value["Email"]),
      data:  String(this.formGroup.value["Data"]),
      descrizione: String(this.formGroup.value["Descrizione"]),
      patologie :(this.formGroup.value["Patologie"])
    };

    this.InscrizioneBambinoService.registerChild(newBody)
      .pipe(
        tap(response => {
          if (response.completed) {
            console.log(response);
          }
        }),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return of(null);
        })
      )
      .subscribe();
   }
  }

}
