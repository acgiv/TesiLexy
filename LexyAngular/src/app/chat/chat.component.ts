import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight, faEllipsisH} from "@fortawesome/free-solid-svg-icons";
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {ChatDirectiveDirective} from "./chat_directive/chat-directive.directive";
import {InputTextComponent} from "../form/input_text/input_text.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ControlFormDirective} from "../form/control-form.directive";
import {multiPatternValidator} from "../form/Validator/validator";
import {ChatList} from "./chat-service.service";
import {cloneDeep} from "lodash";
import {StringUtilsService} from "../Utilitys/string-utils.service";
import {TextAreaComponent} from "../form/textArea/text-area/text-area.component";
import {AccessService} from "../access.service";


declare let bootstrap: any;
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgStyle,
    NgClass,
    ChatMessageComponent,
    NgForOf,
    InputTextComponent,
    FormsModule,
    ReactiveFormsModule,
    TextAreaComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  isOpen = true;
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;
  protected formGroup: FormGroup;
  protected formGroup2: FormGroup;
  protected submit: boolean= false;
  private chat_temp : ChatList | undefined;
  private dropdownListener: any;
  protected errore_testi_associati: boolean;

  @ViewChild('modal_modifica') modal_modifica!: ElementRef;
  constructor(protected chat_directive: ChatDirectiveDirective,
              private fb: FormBuilder,
              protected formD: ControlFormDirective,
              protected stringUtils: StringUtilsService,
              private access_service:  AccessService,
              private cdr: ChangeDetectorRef
  ) {
  this.formGroup = this.fb.group({});
  this.formGroup2 = this.fb.group({});
  this.formD.form.splice(0, this.formD.form.length);
  this.errore_testi_associati = Number(this.access_service.getContaTestiAssociati()) == 0
  }

  ngOnInit() {
    this.chat_directive.list_chat.length=0;
    this.chat_directive.find_all_chat()
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize.bind(this));
       this.formD.form.push(
        {
          label: {
            name: 'ModificaTitolo',
            isRequired: true,
            emojiInfo: {
              message: "Modifica il titolo della chat",
              is_position: "end",
              class: "text-black-50"
            },
          },
          input:{
            class: "form-control pass rounded rounded-1  border  border-dark ",
            typeText: "ModificaTitolo",
            name: 'ModificaTitolo',
            id: "ModificaTitolo",
            placeholder: 'ModificaTitolo',
            validator: [
              Validators.required,
                multiPatternValidator([
                  {pattern: /^[a-zA-Z\s]{3,}$/, errorKey: 'patternTitolo'},

              ])
            ],
            errorMessages: {
              required: 'Campo è obbligatorio',
              patternTitolo:"Il titolo deve essere almeno di 3 caratteri",
            }
         },
          insertEmoji: false
        })
       this.formGroup = this.formD.setAllValidator(this.fb);
       this.formGroup2.addControl("Messaggio", new FormControl());
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewInit(): void {
    if(this.errore_testi_associati){
      this.set_view_modal("show")
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkWindowSize.bind(this));
  }
  @HostListener('window:resize', ['$event'])
  onResize(_: Event) {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    const windowWidth = window.innerWidth;
    this.isOpen = windowWidth >= 768;
  }


  viewText(id_chat:string){
    const index = this.chat_directive.list_chat.findIndex(elem => elem.idchat == id_chat);
    if (this.chat_directive.list_chat[index].message == undefined){
      this.chat_directive.find_message_limit_chat(id_chat);
    }
  this.chat_directive.index_select_chat = index;
  }

  deleteChat(id_chat: string){
    this.chat_directive.destroy_chat_child(id_chat);
    this.chat_directive.closeDropdown();
  }

  renameChat(idchat: string, titolo: string, id_bambino:string){
    this.formGroup.get("ModificaTitolo")?.setValue(cloneDeep(titolo));
    this.set_view_modal("show")
    this.chat_temp = {
      idchat: idchat,
      idbambino: id_bambino,
      titolo: titolo
    }
  }

  newChat(){
    this.chat_directive.create_chat_child();
  }

  annullaModal() {
    this.set_view_modal("hide");
    this.chat_directive.closeDropdown();
  }

  modificaModal() {
     if (this.chat_temp && this.stringUtils.equalsAnyIgnoreCase(this.chat_temp?.titolo,this.formGroup.get("ModificaTitolo")?.value)){
       this.set_view_modal("hide");
     } else if (this.chat_temp){
       this.chat_directive.update_chat_child(this.formGroup, this.chat_temp );
     }
     this.chat_directive.closeDropdown();

  }

    set_view_modal (view:string){
    const modalElement = this.modal_modifica?.nativeElement;
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


  toggleDropdown(event: any) {
    const dropdown = event.target.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      document.removeEventListener('click', this.dropdownListener);
    } else {
      menu.classList.add('show');
      this.dropdownListener = (e: MouseEvent) => this.closeDropdownOnClickOutside(e, dropdown);
      setTimeout(() => {
        document.addEventListener('click', this.dropdownListener);
      }, 0);
    }
  }


  closeDropdownOnClickOutside(event: MouseEvent, dropdown: HTMLElement) {
    if (!dropdown.contains(event.target as Node)) {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu?.classList.contains('show')) {
        menu.classList.remove('show');
      }
      document.removeEventListener('click', this.dropdownListener);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.toggleDropdown(event);
    }
  }

  is_first_message(elem : any): boolean{
    if (elem != undefined){
      const number_message = this.chat_directive?.list_chat?.[this.chat_directive.index_select_chat]?.message?.length
      const number_message_chat = this.chat_directive.list_chat[this.chat_directive.index_select_chat].number_all_message
      const firt_message_list = this.chat_directive?.list_chat?.[this.chat_directive.index_select_chat]?.message?.[0]
      return number_message ==number_message_chat && firt_message_list == elem
    }
    return false
  }

  protected readonly faEllipsisH = faEllipsisH;
  protected readonly Number = Number;

  invia() {
    const chat= this.chat_directive.list_chat[this.chat_directive.index_select_chat];
    this.chat_directive.insert_message(this.chat_directive.index_select_chat,"messaggio", this.formGroup2.get("Messaggio")?.value, true)
    this.chat_directive.result_chat_gpt(chat.idchat, this.formGroup2.get("Messaggio")?.value, this.chat_directive.index_select_chat)
    this.formGroup2.get("Messaggio")?.setValue("");
  }
}
