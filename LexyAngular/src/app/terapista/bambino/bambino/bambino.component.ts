import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ControlFormDirective} from "../../../form/control-form.directive";
import {Router} from "@angular/router";
import {BambinoService, RegisterChild, UpdateChild} from "./bambino.service";
import {AccessService} from "../../../access.service";
import {
  dataValidator,
  multiPatternValidator,
  multiPatternValidatorSelect,
} from "../../../form/Validator/validator";
import {InputSelectComponent} from "../../../form/input-select/input-select.component";
import {InputTextComponent} from "../../../form/input_text/input_text.component";
import {NgForOf, NgIf} from "@angular/common";
import {Bambino} from "../../dashboard/riquest.service";
import {cloneDeep} from "lodash";
import {catchError, of, tap} from "rxjs";
import {StringUtilsService} from "../../../Utilitys/string-utils.service";

@Component({
  selector: 'app-bambino',
  standalone: true,
  imports: [
    InputSelectComponent,
    InputTextComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './bambino.component.html',
  styleUrl: './bambino.component.css'
})
export class BambinoComponent implements OnInit, OnDestroy{

  protected formGroup: FormGroup;
  protected submit: boolean= false;
  protected list_pathology: string[];
  protected list_email: string[];
  protected url: string  | undefined;
  protected is_modifica: boolean;
  protected bambino : Bambino | undefined;
  protected lista_terapisti: any;

  constructor(private fb: FormBuilder,
              protected formD: ControlFormDirective,
              private router: Router,
              private InscrizioneBambinoService : BambinoService,
              private accessService:  AccessService,
              private stringUtils : StringUtilsService
  ) {
    this.url = this.router.url.split("/").at(-1);
    this.formGroup = this.fb.group({});
    this.formD.form.splice(0, this.formD.form.length);
    this.list_pathology = [];
    this.list_email = [];
    this.is_modifica = false;

  }
  ngOnDestroy(): void {
    this.formD.form.length = 0;
  }

  ngOnInit(): void {
    this.set_state_navigator();
    this.create_form_input();
    this.set_initialize_formgroup();
    this.set_list_all_patologie();
    this.set_list_all_terapisti_associati();
  }

   set_state_navigator(){
    const navigation = this.router.getCurrentNavigation();
    let state;

    if (navigation?.extras.state) {
      state = navigation.extras.state;
    } else {
      state = history.state;
    }
    if (state['id_bambino']){
        this.bambino = {
        nome: state['nome'],
        id_bambino: state['id_bambino'],
        cognome: state["cognome"],
        email: state["email"],
        username: state["username"],
        controllo_terapista: state["controllo_terapista"],
        data_nascita: state["data_nascita"],
        descrizione: state["descrizione"],
        patologie: cloneDeep(state["patologie"].map((element: { [x: string]: any; }) => element["nome_patologia"])), // Potresti dover serializzare meglio questo campo
        tipologia: state["tipologia"],
        id_terapista: state["id_terapista"],
        id_utente: state["id_utente"],
        terapista_associati:  cloneDeep(state["terapista_associati"])
        }
        this.lista_terapisti  = cloneDeep(state["terapista_associati"]);
    }
  }



  create_form_input(){
    const is_visualizza = this.is_url_ceck() ==='Visualizza';

        this.formD.form.push(

          {
            label: {
              name: 'Nome',
              isRequired: true,
              emojiInfo: {
                message: "",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control pass rounded rounded-1  border  border-dark ",
              style: "background-image: none;",
              typeText: "text",
              name: 'Nome',
              id: "Nome",
              placeholder: 'Nome',
              disabled: is_visualizza,
              value: this.bambino?.nome? this.bambino.nome:"",
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
              isRequired: true,
               emojiInfo: {
                message: "",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control border border-1 border-dark rounded",
              typeText: 'text',
              name: 'Username',
              id: "Username",
              value:  this.bambino?.username? this.bambino.username : "",
              disabled: is_visualizza,
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
                usernameExist:"Esiste gia un account con questo Username."
              },
            },
            insertEmoji: false
          }, {
            label: {
              name: 'Data',
              isRequired: true,
               emojiInfo: {
                message: "",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control border border-1 border-dark rounded",
              typeText: 'date',
              name: 'Data',
              id: "data",
              placeholder: 'data',
              value:  this.bambino?.data_nascita? this.bambino.data_nascita : "",
              disabled: is_visualizza,
              validator: [
                Validators.required,
                multiPatternValidator([
                  {pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, errorKey: 'patterndata'},
                ],
                 ),
                 dataValidator( "validate_data",  6, new Date())
              ],
              errorMessages: {
                required: 'Questo campo Data è obbligatorio',
                patterndata: "Il formato della data deve essere dd/mm/aaaa. Assicurati di seguire questo formato esatto.",
                validate_data:"Il bambino deve avere almeno 6 anni."
              },
            },
            insertEmoji: false,
          },

          {
            label: {
              name: 'Cognome',
              isRequired: true,
               emojiInfo: {
                message: "",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control  rounded rounded-1  border  border-dark ",
              typeText: 'text',
              name: 'Cognome',
              id: "Cognome",
              value:   this.bambino?.cognome? this.bambino.cognome: "",
              placeholder: 'Congome*',
              disabled: is_visualizza,
              validator: [
                Validators.required,
                multiPatternValidator([
                  {pattern: /^[a-zA-Z]{3,}$/, errorKey: 'patternCognome'},
                ]),

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
              isRequired: true,
               emojiInfo: {
                message: "",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "form-control border border-1 border-dark rounded",
              typeText: 'text',
              name: 'Email',
              id: "Email",
              value:  this.bambino?.email ? this.bambino?.email: "",
              placeholder: 'E-mail*',
              disabled: is_visualizza,
              validator: [
                Validators.required,
                multiPatternValidator([
                  {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, errorKey: 'patternEmail'},
                ]),

              ],
              errorMessages: {
                required: 'Questo campo è obbligatorio',
                patternEmail: 'Indirizzo email non valido. Esempio di formato corretto: esempio@dominio.com.',
                emailExist:"Esiste gia un account con questa email.",
              }
            },
            insertEmoji: false,
          },
          {
            tipeInput: "Select",
            label: {
              name: 'Patologie',
              isRequired: true,
               emojiInfo: {
                message: "Seleziona le patologie del bambino",
                is_position: "end",
                class: "text-black-50"
              },
            },
            input: {
              class: "btn bg-white border border-1 w-100 text-start",
              typeText: 'button',
              id: "Patologie",
              name:"Patologie",
              placeholder: 'Patologie',
              disabled: is_visualizza,
              value:   this.bambino?.patologie ? cloneDeep(this.bambino.patologie): ['Patologie'],
              validator: [
                multiPatternValidatorSelect('Patologie', "required")
              ],
              errorMessages: {
                required: 'Questo campo è obbligatorio',
              },
            },
            insertEmoji: false,
          },
           {
            tipeInput: "Select",
            label: {
              name: 'Terapisti',
              isRequired: true
            },
            input: {
              class: "btn bg-white border border-1 w-100 text-start",
              typeText: 'button',
              id: "Terapisti",
              name:"Terapisti",
              placeholder: 'Terapisti',
              disabled: is_visualizza,
              value:  this.bambino?.terapista_associati? cloneDeep(this.bambino.terapista_associati) : ['Terapisti'],
              validator: [
                multiPatternValidatorSelect('Terapisti', "required")
              ],
              errorMessages: {
                required: 'Questo campo è obbligatorio',
              },
            },
            insertEmoji: false,
          }
        );

         this.formGroup= this.formD.setAllValidator(this.fb);

    }

  is_url_ceck():"Modifica"| "Visualizza" |  "Nuovo" {
    if (this.url == "visualizzaPaziente"){
      if(this.is_modifica){
        return "Modifica"
      }
      return "Visualizza"
    }
    return "Nuovo"
  }

   set_initialize_formgroup(){
      this.formD.setEqualsEndDisable();
      this.formGroup.addControl("Descrizione", new FormControl(this.bambino?.descrizione? this.bambino.descrizione : ""));
      this.formGroup.addControl('AssociaTerapisti', new FormControl(this.bambino?.terapista_associati?this.bambino?.terapista_associati.length >0:false));
      this.formGroup.addControl('ValidazioneTerapista', new FormControl( this.bambino?.controllo_terapista!= undefined?this.bambino?.controllo_terapista:true));
     if(this.is_url_ceck() ==='Visualizza'){
         this.formGroup.get("Descrizione")?.disable();
         this.formGroup.get("ValidazioneTerapista")?.disable();
         this.formGroup.get("AssociaTerapisti")?.disable();
       }
      this.set_check_therapist();
    }

     set_check_therapist(){
     if(this.formGroup.get('AssociaTerapisti')?.value){
        const elem = this.formD.form[6].input;
        this.addDynamicControl(elem.placeholder? elem.placeholder: '', new FormControl([elem.placeholder], elem.validator) );
     }else{
       this.removeDynamicControl("Terapisti");
     }
     return this.formGroup.get('AssociaTerapisti')?.value
  }


  addDynamicControl( name: any, formControl: FormControl) {
        if (!this.formGroup.contains(name)) {
          this.formGroup.addControl(name, formControl);
        }
        this.formGroup.updateValueAndValidity();
  }

  removeDynamicControl(nome: string) {
    if (this.formGroup.contains(nome)) {
    this.formGroup.removeControl(nome);
    this.formGroup.updateValueAndValidity(); // Aggiorna lo stato del form
  }
  }


  set_list_all_patologie() {
    this.InscrizioneBambinoService.register_pathology().subscribe(data => {
      this.list_pathology = data['args']['response']['pathology'];
    });
  }

    set_list_all_terapisti_associati(){
    this.InscrizioneBambinoService.list_user_therapist({"type_user":'terapista'}).subscribe(data => {
      this.list_email = data['args']['response']['email'];
      const index = this.list_email.indexOf(this.accessService.getEmail());
      if (index > -1) {
          this.list_email.splice(index, 1);
      }
    });
  }


createBambino( ) {
  this.submit = true;
  if(this.is_url_ceck()=="Nuovo"){
     if(this.formGroup.valid){
      this.registra_bambino();
   }
  }else if(this.is_url_ceck()=="Visualizza"){
    this.is_modifica=true;
    this.formGroup.get("Nome")?.enable();
    this.formGroup.get("Cognome")?.enable();
    this.formGroup.get("Email")?.enable();
    this.formGroup.get("Data")?.enable();
    this.formGroup.get("Descrizione")?.enable();
    this.formGroup.get("ValidazioneTerapista")?.enable();
    this.formGroup.get("AssociaTerapisti")?.enable();
    this.formD.form[5].input.disabled=false;
    this.formD.form[6].input.disabled=false;
    this.formGroup.get("Patologie")?.enable();
    this.formGroup.get("Terapisti")?.enable();
    }else if (this.formGroup.valid) {
        const modifiche = this.is_update();
        if (Object.keys(modifiche).length !== 0) {
            const newBody:  UpdateChild= {
            id_bambino: String(this.bambino?.id_bambino),
            nome: String(this.formGroup.value["Nome"]),
            cognome:  String(this.formGroup.value["Cognome"]),
            username:  String(this.bambino?.username),
            email:  String(this.formGroup.value["Email"]),
            data:  String(this.formGroup.value["Data"]),
            descrizione: this.formGroup.value["Descrizione"],
            patologie :(this.formGroup.value["Patologie"]),
            id_terapista: this.accessService.getId(),
            controllo_terapista: Boolean(this.formGroup.value["ValidazioneTerapista"]),
            terapisti_associati: this.formGroup.value['AssociaTerapisti']? this.formGroup.value['Terapisti']: null,
            update_value :  Object.keys(modifiche)
            };
            this.InscrizioneBambinoService.update_child(newBody)
              .pipe(
                tap(response => {
                  if (response.args.completed) {
                     this.is_modifica = false;
                     if(this.bambino) {
                       this.bambino.id_bambino = String(this.bambino?.id_bambino);
                       this.bambino.nome = String(this.formGroup.value["Nome"]);
                       this.bambino.cognome =  String(this.formGroup.value["Cognome"]);
                       this.bambino.email = String(this.formGroup.value["Email"]);
                       this.bambino.data_nascita =  String(this.formGroup.value["Data"]);
                       this.bambino.descrizione = this.formGroup.value["Descrizione"];
                       this.bambino.patologie = cloneDeep(this.formGroup.value["Patologie"]);
                       this.bambino.controllo_terapista = this.formGroup.value["ValidazioneTerapista"];
                       this.bambino.terapista_associati = cloneDeep(this.formGroup.value["Terapisti"]);
                     }
                   this.disable_all_component();
                  } else {
                    for (let i = 0; i < response.args.error.number_error ;i++) {
                      let keys = Object.keys(response.args.error.message[i]);
                      this.set_error_clone_register(keys[0]);
                    }
                  }
                }),
                catchError(error => {
                  console.error('Errore durante la registrazione:', error);
                  return of(null);
                })
              )
              .subscribe();
      }else{
       this.annulla_modifiche();
      }
    }
  }

  is_update():any {
    let update= Object();
    if(this.bambino != undefined){
      this.is_update_string("Nome",this.bambino.nome, this.formGroup.get("Nome")?.value, update);
      this.is_update_string("Congome",this.bambino.cognome, this.formGroup.get("Cognome")?.value, update);
      this.is_update_string("Email",this.bambino.email,  this.formGroup.get("Email")?.value, update);
      this.is_update_string("Data",this.bambino.data_nascita,  this.formGroup.get("Data")?.value, update);
      this.is_update_string("Descrizione",this.bambino.descrizione,  this.formGroup.get("Descrizione")?.value, update);
      if(!this.stringUtils.compareArrays(this.bambino.patologie, this.formGroup.get("Patologie")?.value)){
             update["Patologie"]= true;
      }
      if(this.bambino.controllo_terapista!= this.formGroup.get("ValidazioneTerapista")?.value){
         update["ValidazioneTerapista"]= true;
      }
      if(this.bambino.terapista_associati ){
        console.log(this.stringUtils.compareArrays(this.bambino.terapista_associati, this.formGroup.get("Terapisti")?.value));
        if( this.bambino?.terapista_associati.length!=0 != this.formGroup.get("AssociaTerapisti")?.value){
           update["AssociaTerapisti"]= true;
        }
        if(!this.stringUtils.compareArrays(this.bambino.terapista_associati, this.formGroup.get("Terapisti")?.value)){
            update["Terapisti"]= true;
        }
       }
    }
    return update
  }

  is_update_string(keys:string, element1:string, element2:string, dict_error:any){
    if(element1 != element2 && !this.stringUtils.equalsAnyIgnoreCase(element1 ,element2)) {
       dict_error[keys] = true;
     }
  }

  registra_bambino(){
    const newBody:  RegisterChild= {
      nome: String(this.formGroup.value["Nome"]),
      cognome:  String(this.formGroup.value["Cognome"]),
      username:  String(this.formGroup.value["Username"]),
      email:  String(this.formGroup.value["Email"]),
      data:  String(this.formGroup.value["Data"]),
      descrizione: this.formGroup.value["Descrizione"],
      patologie :(this.formGroup.value["Patologie"]),
      id_terapista: this.accessService.getId(),
      controllo_terapista: Boolean(this.formGroup.value["ValidazioneTerapista"]),
      terapisti_associati: this.formGroup.value['AssociaTerapisti']? this.formGroup.value['Terapisti']: null
    };
    this.InscrizioneBambinoService.register_child(newBody)
      .pipe(
        tap(response => {
          if (response.args.completed) {
              this.router.navigate(['/terapista/dashboard']).then(() => { this.formD.ngOnDestroy()});
          } else {
            for (let i = 0; i < response.args.error.number_error ;i++) {
              let keys = Object.keys(response.args.error.message[i]);
              this.set_error_clone_register(keys[0]);
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

  set_error_clone_register( keys: string ) {
    if (keys === "email") {
    this.formGroup.get("Email")?.setErrors({"emailExist":true});
    this.formGroup.updateValueAndValidity();
    } else {
      this.formGroup.get(["Username"])?.setErrors({"usernameExist": true});
    }
  }


  annulla_modifiche() {
    this.is_modifica= false;
    this.disable_all_component();
    this.formGroup.get("Terapisti")?.setValue(cloneDeep(this.bambino?.terapista_associati));
    this.formGroup.get("Patologie")?.setValue(cloneDeep(this.bambino?.patologie));
    console.log(this.bambino?.controllo_terapista);
    this.formGroup.patchValue({
      Nome: this.bambino?.nome,
      Cognome: this.bambino?.cognome,
      Data: this.bambino?.data_nascita,
      Email: this.bambino?.email,
      Descrizione: this.bambino?.descrizione,
      ValidazioneTerapista:this.bambino?.controllo_terapista,
      AssociaTerapisti: this.bambino?.terapista_associati.length !== 0
    });
  }
  disable_all_component(){
    this.formGroup.get("Nome")?.disable();
    this.formGroup.get("Email")?.disable();
    this.formGroup.get("Cognome")?.disable();
    this.formGroup.get("Data")?.disable();
    this.formGroup.get("Descrizione")?.disable();
    this.formGroup.get("ValidazioneTerapista")?.disable();
    this.formGroup.get("AssociaTerapisti")?.disable();
    this.formD.form[5].input.disabled=true;
    this.formD.form[6].input.disabled=true;
  }
}



