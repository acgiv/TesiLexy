import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {TextAreaComponent} from "../../../form/textArea/text-area/text-area.component";
import {ControlFormDirective} from "../../../form/control-form.directive";
import {multiPatternValidator} from "../../../form/Validator/validator";

@Component({
  selector: 'app-testo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    TextAreaComponent,
    NgForOf
  ],
  templateUrl: './testo.component.html',
  styleUrl: './testo.component.css'
})
export class TestoComponent implements OnInit, OnDestroy{
  formGroup: FormGroup;
  protected is_modifica: boolean = false;
  private readonly url: string | undefined;
  protected submit: boolean= false;
  constructor(private router: Router,
              private fb: FormBuilder,
              protected formD: ControlFormDirective,
              ) {
    this.url = this.router.url.split("/").at(-1);
    this.formGroup = this.fb.group({});
    this.formD.form.splice(0, this.formD.form.length);

  }

  ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

  ngOnInit(): void {
         this.create_form_input();
    }

  create_form_input(){
      this.formD.form.push(
        {
            tipeInput: "TextArea",
            label: {
              name: 'Titolo',
              isRequired: true,
              emojiInfo: {
                message: "Inserisci il titolo del testo.",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control border border-1  ",
              style: "height: 100px;",
              typeText: "",
              name: 'Titolo',
              id: "Titolo",
              placeholder: "Inserisci il Titolo del testo",
              disabled: false,
              value: "",
              validator: [
                Validators.required,
                multiPatternValidator([
                ])
              ],
              errorMessages: {
                required: 'Campo è obbligatorio',
              },
            },
            insertEmoji: false
          },
           {
            tipeInput: "TextArea",
            label: {
              name: 'Testo',
              isRequired: true,
              emojiInfo: {
                message: "Inserisci il testo del racconto",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control border border-1 ",
              style: "height: 400px;",
              typeText: "",
              name: 'Testo',
              id: "Testo",
              placeholder: "Inserisci qui il testo...",
              disabled: false,
              value: "",
              validator: [
                Validators.required,
                multiPatternValidator([
                ])
              ],
              errorMessages: {
                required: 'Campo è obbligatorio',
              },
            },
            insertEmoji: false
          },

      )
      this.formGroup= this.formD.setAllValidator(this.fb);
  }

  is_url_ceck():"Modifica"| "Visualizza" |  "Nuovo" {
    if (this.url == "visualizzaTesto"){
      if(this.is_modifica){
        return "Modifica"
      }
      return "Visualizza"
    }
    return "Nuovo"
  }

  annulla_modifiche() {
    console.log("annulla");
  }

  creaTesto() {
    this.submit = true;
    console.log("crea");
  }
}
