import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {TextAreaComponent} from "../../form/textArea/text-area/text-area.component";
import {ControlFormDirective} from "../../form/control-form.directive";
import {multiPatternValidator, multiPatternValidatorSelect} from "../../form/Validator/validator";
import {InputTextComponent} from "../../form/input_text/input_text.component";
import {InputSelectComponent} from "../../form/input-select/input-select.component";
import {Testo, TestoService} from "./testo.service";
import {AccessService} from "../../access.service";
import {cloneDeep} from "lodash";


@Component({
  selector: 'app-testo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    TextAreaComponent,
    NgForOf,
    InputTextComponent,
    InputSelectComponent
  ],
  templateUrl: './testo.component.html',
  styleUrl: './testo.component.css'
})
export class TestoComponent implements OnInit, OnDestroy{
  formGroup: FormGroup;
  protected is_modifica: boolean = false;
  private readonly url: string | undefined;
  protected submit: boolean= false;
  protected list_tipologia_testo: string[];
  protected testo: Testo | undefined;
  protected state: any;
  constructor(private router: Router,
              private fb: FormBuilder,
              protected formD: ControlFormDirective,
              protected testo_service :TestoService,
              private accessService:  AccessService,
              ) {
    console.log(this.router.url);
    this.url = this.router.url.split("/").at(-1);
    this.formGroup = this.fb.group({});
    this.formD.form.splice(0, this.formD.form.length);
    this.list_tipologia_testo = [];

  }

  ngOnDestroy(): void {
    // function destroy components
    }

  ngOnInit(): void {
    this.set_state_navigator();
    this.create_form_input();
    this.set_list_all_materia();
    }

  set_state_navigator(){
    const navigation = this.router.getCurrentNavigation();


    if (navigation?.extras.state) {
      this.state = navigation.extras.state;
    } else {
      this.state = history.state;
    }
    if (this.state['id_testo']){
          this.testo ={
          id_testo: cloneDeep(this.state['id_testo']),
          titolo: cloneDeep(this.state['Titolo']),
          tipologia_testo: cloneDeep(this.state['Materia']),
          testo: cloneDeep(this.state['Testo']),
          eta_riferimento: cloneDeep(this.state['Eta'])
          }

        }
    }


  create_form_input(){
      const visualizza = this.url =='visualizzaTesto';
      this.formD.form.push(
        {
            tipeInput: "Select",
            label: {
              name: 'Materia',
              isRequired: true,
               emojiInfo: {
                message: "Seleziona la materia del testo",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "btn bg-white border border-1 w-100 text-start ",
              typeText: 'button',
              id: "Materia",
              name:"Materia",
              placeholder: 'Materia',
              disabled: visualizza,
              value: this.testo?cloneDeep([this.testo.tipologia_testo]):['Materia'],
              validator: [
                multiPatternValidatorSelect('Materia', "required")
              ],
              errorMessages: {
                required: 'Questo campo è obbligatorio',
              },
            },
            insertEmoji: false,
          },
        {
            label: {
              name: 'Eta di riferimento',
              isRequired: true,
              emojiInfo: {
                message: "Inserisci l'età di riferimento",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control pass rounded rounded-1  border  border-dark ",
              style: "background-image: none;",
              typeText: "text",
              name: 'Eta',
              id: "Eta",
              placeholder: "Inserisci l'ètà di riferimento per il testo",
              disabled: visualizza,
              value: this.testo?cloneDeep(String(this.testo.eta_riferimento)):"",
              maxLength:2,
              validator: [
                Validators.required,
                multiPatternValidator([
                  {pattern: /^\d{1,2}$/, errorKey: 'patternEta'},
                ])
              ],
              errorMessages: {
                required: 'Campo è obbligatorio',
                patternEta: 'Hai iserito un ètà di riferimento sbagliata',
              },
            },
            insertEmoji: false
          },
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
              disabled: visualizza,
              value: this.testo?cloneDeep(String(this.testo.titolo)):"",
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
              disabled: visualizza,
              value: this.testo?cloneDeep(String(this.testo.testo)):"",
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
     this.is_modifica= false;
     this.disable_component();
     this.undo_value();

  }

  undo_value(){
    for (let index in this.formD.form) {
      let component = this.formD.form[index];
      this.formGroup.get(component.input.name)?.setValue(
        cloneDeep(component.tipeInput=='Select'? [this.state[component.input.name]]:this.state[component.input.name]));
    }
  }


  creaTesto() {
    this.submit = true;
    if(this.is_url_ceck()=="Nuovo") {
      if (this.formGroup.valid) {
        this.submit = true;
        this.insert_text();
      }
    }else if(this.is_url_ceck()=="Visualizza"){
          this.is_modifica=true;
          this.enable_component();
    } else if (this.formGroup.valid){
       if (this.is_update()){
         const body: any =  Object();
         body.id_testo = this.testo?.id_testo;
         body.testo = this.formGroup.get("Testo")?.value;
         body.titolo = this.formGroup.get("Titolo")?.value;
         body.eta_riferimento =this.formGroup.get("Eta")?.value;
         body.materia =this.formGroup.get("Materia")?.value[0];
         this.testo_service.update_text(body).subscribe((data =>{
           console.log(data.args.response);
         }));
       }
       this.disable_component();
       this.is_modifica= false;
    }
  }

is_update(): any {
  for (let index in this.formD.form) {
    let component = this.formD.form[index];
    if (this.formGroup.get(component.input.name)?.value != this.state[component.input.name]) {
      return true;
    }
  }
  return false;
}

  disable_component(){
    for(let index in this.formD.form){
      let component = this.formD.form[index];
      this.formGroup.get(component.input.name)?.disable()
      if (component.tipeInput==='Select'){
          component.input.disabled =true;
      }
    }
  }

  enable_component(){
    for(let index in this.formD.form){
      let component = this.formD.form[index];
      this.formGroup.get(component.input.name)?.enable()
      if (component.tipeInput==='Select'){
          component.input.disabled =false;
      }
    }
  }

  insert_text(){
    let body = Object();
      body.titolo = this.formGroup.get("Titolo")?.value;
      body.testo = this.formGroup.get("Testo")?.value;
      body.eta_riferimento = this.formGroup.get("Eta")?.value;
      body.materia = this.formGroup.get("Materia")?.value;
      body.id_terapista = this.accessService.getId();
      this.testo_service.insert_text(body).subscribe((data =>{
        if(data.args.completed){
           this.router.navigate(["terapista/dashboard"]).then(() => {});
        }
      }));
    }

  set_list_all_materia() {
      this.testo_service.find_all_materia().subscribe(data => {
      this.list_tipologia_testo = data['args']['response']['materia'];
      });
  }

}
