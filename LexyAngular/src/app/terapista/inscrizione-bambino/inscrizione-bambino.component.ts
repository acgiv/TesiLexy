import {Component, OnInit} from '@angular/core';
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
import {multiPatternValidator} from "../../Validator/validator";
import {InputSelectComponent} from "../../form/input-select/input-select.component";

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
export class InscrizioneBambinoComponent  implements OnInit {

  formGroup: FormGroup;
  protected submit: boolean= false;


  constructor( private fb: FormBuilder, protected formD: ControlFormDirective) {
    this.formGroup = this.fb.group({});
    this.formD.form.push(
      {
        label:{
          name:'Nome',
          isRequired:true
        },
        input:{
          class: "form-control pass rounded rounded-1  border  border-dark ",
          style:"background-image: none;",
          typeText: "text",
          name: 'Nome',
          id: "Nome",
          placeholder: 'Nome',
          validator: [
            multiPatternValidator([
              { pattern: /^[a-zA-Z]{3,}$/, errorKey: 'patternNome'},
            ])
          ],
          errorMessages: {
            required: 'Campo è obbligatorio',
            patternNome: 'Il nome deve essere lungo almeno 3 caratteri.',
            nomeEsistente: "Esiste gia un utente con questo nome"
          },
         },
        insertEmoji: false
      },{
         label:{
          name:'Username',
          isRequired:true
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
      },{
         label:{
          name:'Data',
          isRequired:true
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
      },{
         label:{
          name:'Cognome',
          isRequired:true
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
      },{
         label:{
          name:'Email',
          isRequired:true
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
      }
    );
  }
  ngOnInit(): void {
    const formControls = this.formD.form.reduce((acc:{ [key: string]: any[] }, curr) => {
        acc[curr.input.name] = ['', curr.input.validator];
      return acc;
    }, {});
    this.formGroup= this.fb.group(formControls);
  }

  createBambino(form : FormGroupDirective ) {
   this.submit = true;
   if(this.formGroup.valid){
    console.log('sono qui');
   }
  }


}
