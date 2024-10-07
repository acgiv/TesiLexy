import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {TextAreaComponent} from "../../form/textArea/text-area/text-area.component";
import {ControlFormDirective} from "../../form/control-form.directive";
import {multiPatternValidator, multiPatternValidatorSelect} from "../../form/Validator/validator";
import {InputTextComponent} from "../../form/input_text/input_text.component";
import {InputSelectComponent} from "../../form/input-select/input-select.component";
import {AccessService} from "../../access.service";
import {cloneDeep} from "lodash";
import {TestoAdattatoService} from "./testo_adattato.service";
import {Testo} from "../testo/testo.service";
import {StringUtilsService} from "../../Utilitys/string-utils.service";
declare let bootstrap: any;

@Component({
  selector: 'app-testo_spiegato',
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
  templateUrl: './testo_adattato.component.html',
  styleUrl: './testo_adattato.component.css'
})

export class TestoAdattatoComponent  implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  protected is_modifica: boolean = false;
  private readonly url: string | undefined;
  protected submit: boolean = false;
  protected list_tipologia_testo: string[];
  protected lista_bambini: string[];
  protected lista_bambini_state: string[];

  protected lista_text_original: Testo[];
  protected testo: Testo | undefined;
  protected testo_adattato: Testo | undefined;
  protected lista_titoli: string[];
  protected state: any;
  protected index_list_testo: number;
  protected index_list_testo_state: number;
  private  body: any;
  @ViewChild('modal_error') modal_error!: ElementRef;
  constructor(private router: Router,
              private fb: FormBuilder,
              protected formD: ControlFormDirective,
              protected testo_service: TestoAdattatoService,
              private accessService: AccessService,
              private cdr: ChangeDetectorRef,
              private String_utils_service: StringUtilsService
  ) {
    this.formGroup = this.fb.group({});
    this.url = this.router.url.split("/").at(-1);
    this.formD.form.splice(0, this.formD.form.length);
    this.list_tipologia_testo = [];
    this.lista_bambini = [];
    this.lista_text_original = [];
    this.lista_titoli=[]
    this.index_list_testo = 0;
    this.index_list_testo_state = 0;
    this.lista_bambini_state = [];
  }

  ngOnInit(): void {
    this.set_state_navigator();
    this.set_list_all_user_child();
    this.set_list_title();
    this.create_form_input();
  }

  ngAfterViewInit(): void {
    this.view_modal_error()
    this.cdr.detectChanges();
  }

  set_list_all_user_child() {
    let body: any = Object();
    body.id_terapista = this.accessService.getId();
    this.testo_service.set_list_all_user_child(body).subscribe(data => {
      this.lista_bambini = data['args']['response']['child'];
    });
  }

  set_list_title(){
    for (let index in this.lista_text_original){
      this.lista_titoli.push(this.lista_text_original[index].titolo);
    }

  }

  view_modal_error() {
    if (this.lista_text_original.length ===0) {
      this.set_view_modal("view");
    }
  }

  set_view_modal (view:string){
    const modalElement = this.modal_error?.nativeElement;
     if (modalElement) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        if (modalInstance) {
          if (view =="hide"){
            modalInstance.hide();
          }else{
            modalInstance.show();
          }

        }
      }
  }




  set_state_navigator() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.state = navigation.extras.state;
    } else {
      this.state = history.state;
    }
    if (this.state["lista"]) {
      this.lista_text_original = this.state["lista"]
    }
     this.testo_adattato = {
       id_testo : this.state["id_testo"],
       titolo : this.state["Titolo"],
       testo :  this.state["Testo"],
       materia : this.state["Materia"],
       eta_riferimento : this.state["Eta"],
       tipologia_testo: "testo_spiegato",
       id_testo_spiegato:  this.state["id_testo_spiegato"]
     }
    if (this.state["chile_list"]) {
      this.lista_bambini_state = this.state["chile_list"];
    }
     if (this.testo_adattato?.id_testo_spiegato) {
       this.index_list_testo_state = this.lista_text_original.findIndex((element) => element.id_testo == this.testo_adattato?.id_testo_spiegato);
       this.index_list_testo = cloneDeep(this.index_list_testo_state);
     }
  }

  create_form_input() {
    const visualizza = this.url == 'visualizzaTestoAdattato';
    this.formD.form.push(
      {
        label: {
          name: 'Materia',
          isRequired: true,
          emojiInfo: {
            message: "Materia",
            is_position: "end",
            class: "text-black-50"
          },
        },
        input: {
          class: "form-control pass rounded rounded-1  border  border-dark ",
          style: "background-image: none;",
          typeText: "text",
          name: 'Materia',
          id: "Materia",
          placeholder: this.lista_text_original.length >0 ?this.lista_text_original[this.index_list_testo].materia:"Materia",
          disabled: true,
          value: this.testo ? cloneDeep(String(this.testo.eta_riferimento)) : "",
          maxLength: 2,
          validator: [],
          errorMessages: {
            required: 'Campo è obbligatorio',
            patternEta: 'Hai iserito un ètà di riferimento sbagliata',
          },
        },
        insertEmoji: false
      },
      {
        label: {
          name: 'Eta di riferimento del testo',
          isRequired: true,
          emojiInfo: {
            message: "l'età di riferimento del testo",
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
          placeholder: "Età di riferimento del testo",
          disabled: true,
          value: this.lista_text_original?.length>0 ? String(this.lista_text_original[this.index_list_testo].eta_riferimento):"",
          maxLength: 2,
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
        tipeInput: "Select",
        label: {
          name: 'Titolo',
          isRequired: true,
          emojiInfo: {
            message: "Seleziona il titolo  del testo",
            is_position: "end",
            class: "text-black-50"
          },
        },
        input: {
          class: "btn bg-white border border-1 w-100 text-start ",
          typeText: 'button',
          id: "Titolo",
          name: "Titolo",
          placeholder: 'Titolo',
          disabled: visualizza,
          multi_select: false,
          value: this.lista_text_original?.length>0 ? [this.lista_text_original[this.index_list_testo].titolo]:["Titolo"],
          validator: [
            multiPatternValidatorSelect('Titolo', "required")
          ],
          errorMessages: {
            required: 'Questo campo è obbligatorio',
          },
        },
        insertEmoji: false,
      },
      {
        tipeInput: "TextArea",
        label: {
          name: 'Testo',
          isRequired: true,
          emojiInfo: {
            message: "il testo originale del racconto selezionato",
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
          placeholder: "",
          disabled: true,
          value: this.lista_text_original?.length>0 ? [this.lista_text_original[0].testo]:"",
          validator: [
            Validators.required,
            multiPatternValidator([])
          ],
          errorMessages: {
            required: 'Campo è obbligatorio',
          },
        },
        insertEmoji: false
      },
      {
        label: {
          name: 'Eta di riferimento',
          isRequired: true,
          emojiInfo: {
            message: "l'età di riferimento del testo adattato",
            is_position: "end",
            class: "text-black-50"
          },
        },
        input: {
          class: "form-control pass rounded rounded-1  border  border-dark ",
          style: "background-image: none;",
          typeText: "text",
          name: 'EtaAssociato',
          id: 'EtaAssociato',
          placeholder: "Inserisci l'ètà di riferimento per il testo",
          disabled: visualizza,
          value: this.testo_adattato?.eta_riferimento ? cloneDeep(String(this.testo_adattato.eta_riferimento)) : "",
          maxLength: 2,
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
        tipeInput: "Select",
        label: {
          name: ' Associa Bambini',
          isRequired: true,
          emojiInfo: {
            message: "Associa i bambini a questo testo di riferimento spiegato",
            is_position: "end",
            class: "text-black-50"
          },
        },
        input: {
          class: "btn bg-white border border-1 w-100 text-start ",
          typeText: 'button',
          id: "Bambini",
          name: "Bambini",
          placeholder: 'Bambini',
          disabled: visualizza,
          multi_select: true,
          value: this.lista_bambini_state.length >0? cloneDeep(this.lista_bambini_state): ['Bambini'],
          validator: [
            multiPatternValidatorSelect('Bambini', "required")
          ],
          errorMessages: {
            required: 'Questo campo è obbligatorio',
          },
        },
        insertEmoji: false,
      },
      {
        tipeInput: "TextArea",
        label: {
          name: 'Titolo Testo Adattato',
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
          name: 'TitoloAssociato',
          id: "TitoloAssociato",
          placeholder: "Inserisci il Titolo del testo",
          disabled: visualizza,
          value: this.testo_adattato?.titolo ? cloneDeep(String(this.testo_adattato.titolo)) : "",
          validator: [
            Validators.required,
            multiPatternValidator([])
          ],
          errorMessages: {
            required: 'Campo è obbligatorio',
            notUniqueTitolo: "Esiste gia un testo con questo titolo"
          },
        },
        insertEmoji: false
      },
      {
        tipeInput: "TextArea",
        label: {
          name: 'Testo Adattato',
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
          name: 'TestoAdattato',
          id: "TestoAdattato",
          placeholder: "Inserisci qui il testo...",
          disabled: visualizza,
          value: this.testo_adattato?.testo ? cloneDeep(String(this.testo_adattato.testo)) : "",
          validator: [
            Validators.required,
            multiPatternValidator([])
          ],
          errorMessages: {
            required: 'Campo è obbligatorio',
          },
        },
        insertEmoji: false
      },
    )
    this.formGroup = this.formD.setAllValidator(this.fb);
  }

  is_url_ceck(): "Modifica" | "Visualizza" | "Nuovo" {
    if (this.url == "visualizzaTestoAdattato") {
      if (this.is_modifica) {
        return "Modifica"
      }
      return "Visualizza"
    }
    return "Nuovo"
  }

  annulla_modifiche() {
    this.is_modifica = false;
    this.disable_component();
    this.undo_value();

  }

  undo_value() {
    this.formGroup.get("EtaAssociato")?.setValue(cloneDeep(this.testo_adattato?.eta_riferimento));
    this.formGroup.get("Bambini")?.setValue(cloneDeep(this.lista_bambini_state));
    this.formGroup.get("TitoloAssociato")?.setValue(cloneDeep(this.testo_adattato?.titolo));
    this.formGroup.get("TestoAdattato")?.setValue(cloneDeep(this.testo_adattato?.testo));
  }

  creaTesto() {
    this.submit = true;

    if (this.is_url_ceck() == "Nuovo") {
      if (this.formGroup.valid) {
        this.submit = true;
        this.insert_text();
      }
    } else if (this.is_url_ceck() == "Visualizza") {
      this.is_modifica = true;
      this.enable_component();
    } else if (this.formGroup.valid) {
      let update = this.is_update();
      if (update.change) {
         console.log("sono qui");
        this.body=  Object();
        this.body.id_testo = this.testo_adattato?.id_testo;
        this.body.titolo = String(this.formGroup.get("TitoloAssociato")?.value);
        this.body.testo = this.formGroup.get("TestoAdattato")?.value;
        this.body.eta_riferimento = String(this.formGroup.get("EtaAssociato")?.value)
        this.body.lista_bambini = this.formGroup.get("Bambini")?.value
        this.body.update_list_child = update.child;
         this.body.update_text = update.text;
        this.testo_service.update_text(this.body).subscribe((_ => {}));
      }
      this.disable_component();
      this.is_modifica = false;
    }
  }

  is_update(): any {
    let update: any = Object();
    update.change = update.child =  update.text= false;
    if(this.testo_adattato){
        if (!this.String_utils_service.equalsAnyIgnoreCase(String(this.formGroup.get("EtaAssociato")?.value), cloneDeep(String(this.testo_adattato?.eta_riferimento)))){
          update.text = true;
          update.change = true;
        }
        if (!this.String_utils_service.equalsAnyIgnoreCase(String(this.formGroup.get("TitoloAssociato")?.value), cloneDeep(this.testo_adattato?.titolo))){
          update.text = true;
          update.change = true;
        }
        if (!this.String_utils_service.equalsAnyIgnoreCase(String(this.formGroup.get("TestoAdattato")?.value), cloneDeep(this.testo_adattato?.testo))){
          update.text = true;
          update.change = true;
        }
        if (!this.String_utils_service.compareArrays( cloneDeep(this.lista_bambini_state),  this.formGroup.get("Bambini")?.value )){
           update.child = true;
           update.change = true;
        }
       }
    return update;
  }

  disable_component() {
      let len = this.formD.form.length
      for (let index=4; index< len; index++) {
         let component = this.formD.form[index];
         if( component.input.name){
           this.formGroup.get(component.input.name)?.disable()
           if (component.tipeInput === 'Select') {
                component.input.disabled = true;
            }
         }

    }
  }

  enable_component() {
      let len = this.formD.form.length
      for (let index=4; index<len ; index++) {
         let component = this.formD.form[index];
          if(component.input != undefined){
           this.formGroup.get(component.input.name)?.enable()
           if (component.tipeInput === 'Select') {
             component.input.disabled = false;
           }
     }
    }
  }

  insert_text() {
    this.body = Object();
    this.body.titolo = this.formGroup.get("TitoloAssociato")?.value;
    this.body.testo = this.formGroup.get("TestoAdattato")?.value;
    this.body.eta_riferimento = this.formGroup.get("EtaAssociato")?.value;
    this.body.materia = [this.lista_text_original[this.index_list_testo].materia];
    this.body.id_terapista = this.accessService.getId();
    this.body.id_index_testo = this.index_list_testo;
    this.body.tipologia = "spiegato";
    this.body.id_testo_spiegato  = this.lista_text_original[this.index_list_testo].id_testo;
    this.body.lista_user_child = this.formGroup.get("Bambini")?.value
    this.testo_service.insert_text(this.body).subscribe((response => {
      if (response.args.completed) {
        this.router.navigate(["terapista/dashboard"], {state: {navigatedByButton: true}}).then(() => {
        });
      } else {
          for (let i = 0; i < response.args.error.number_error; i++) {
            let keys = Object.keys(response.args.error.message[i])[0];
            this.set_error_clone_register(keys);
          }
      }
    }));
  }

  private set_error_clone_register(keys: string) {
    if (keys ==="notUniqueTitolo"){
      this.formGroup.get("TitoloAssociato")?.setErrors({"notUniqueTitolo":true});
    }
  }

  redirectDashboard() {
     this.router.navigate(["terapista/dashboard"], {state: {navigatedByButton: true}}).then(() => {
       this.formD.ngOnDestroy()
       this.lista_text_original.length=0;
       this.lista_bambini.length=0;
       this.set_view_modal("hide");
        });
  }

    redirectCreaTesto() {
      this.router.navigate(["terapista/dashboard/inserisciTesto"], {state: {navigatedByButton: true}}).then(() => {
         this.formD.ngOnDestroy()
         this.lista_text_original.length=0;
         this.lista_bambini.length=0;
         this.set_view_modal("hide");
      });
    }


  onIndexSelected($event: number) {
    this.index_list_testo = $event;
    if ($event ==0 &&  this.formGroup.get("Titolo")?.value[0] =="Titolo"){
      this.formGroup.get("Materia")?.setValue('Materia del testo di riferimento');
      this.formGroup.get("Eta")?.setValue("");
      this.formGroup.get("Testo")?.setValue("");
    }else{
      this.formGroup.get("Materia")?.setValue(this.lista_text_original[$event].materia);
      this.formGroup.get("Eta")?.setValue(this.lista_text_original[$event].eta_riferimento);
      this.formGroup.get("Testo")?.setValue(this.lista_text_original[$event].testo);
    }

  }


}

