import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight, faEllipsisH} from "@fortawesome/free-solid-svg-icons";
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {ChatDirectiveDirective} from "./chat_directive/chat-directive.directive";
import {InputTextComponent} from "../form/input_text/input_text.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ControlFormDirective} from "../form/control-form.directive";
import {multiPatternValidator} from "../form/Validator/validator";
import {ChatList} from "./chat-service.service";
import {cloneDeep} from "lodash";
import {StringUtilsService} from "../Utilitys/string-utils.service";
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
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy{
  isOpen = true;
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;
  protected formGroup: FormGroup;
  protected submit: boolean= false;
  private chat_temp : ChatList | undefined;
  private dropdownListener: any;
  @ViewChild('modal_modifica') modal_modifica!: ElementRef;
  constructor(protected chat_directive: ChatDirectiveDirective,
              private fb: FormBuilder,
              protected formD: ControlFormDirective,
              protected stringUtils: StringUtilsService
  ) {
  this.formGroup = this.fb.group({});
  this.formD.form.splice(0, this.formD.form.length);

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
        });
       this.formGroup = this.formD.setAllValidator(this.fb);
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
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


  viewText(){
    alert("Render Chat");
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

  protected readonly faEllipsisH = faEllipsisH;
}
