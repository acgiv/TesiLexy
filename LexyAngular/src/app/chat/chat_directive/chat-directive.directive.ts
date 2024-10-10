import {Directive} from '@angular/core';
import {AccessService} from "../../access.service";
import {ChatList, ChatServiceService} from "../chat-service.service";
import {FormGroup} from "@angular/forms";
@Directive({
  selector: '[appChatDirective]',
  standalone: true
})
export class ChatDirectiveDirective{

  list_chat: ChatList[];
  protected body: any;
  constructor( private access_service:  AccessService, protected chat_service :ChatServiceService) {
    this.list_chat = []
  }


  find_all_chat(){
    this.body = Object();
    this.body.id_bambino = this.access_service.getId();
    this.body.limit = 20;
    this.chat_service.find_all_Chat(this.body).subscribe(result =>{
      if(result.args.completed){
        this.list_chat= result.args.response.list_chat;
      }
    });
  }


  create_chat_child(){
    this.body = Object();
    this.body.id_bambino = this.access_service.getId();
    this.chat_service.create_chat(this.body).subscribe(result =>{
      if(result.args.completed){
         this.list_chat.push(result.args.response);
      }
    });
  }

  find_message_limit_chat(idchat: string){
    this.body = Object();
    this.body.id_bambino = this.access_service.getId();
    this.body.id_chat = idchat;
    this.body.limit = null;
    this.chat_service.find_message_limit_chat(this.body).subscribe(result =>{
      if(result.args.completed){
         const index = this.list_chat.findIndex(chat => chat.idchat === idchat);
          if (index !== -1) {
            this.list_chat[index].message =result.args.response.message;
            this.list_chat[index].number_all_message= result.args.response.number_all_message;
            console.log(this.list_chat)
          }
      }
    });
  }

  destroy_chat_child(id_chat: string){
      this.body = Object();
      this.body.id_chat = id_chat;
      this.chat_service.destroy_chat(this.body).subscribe(result =>{
        if(result.args.completed) {
          this.list_chat = this.list_chat.filter(element => element.idchat != id_chat);
        }
    });
  }

   update_chat_child(formgroup: FormGroup, chat_temp: ChatList){
    this.body = Object();
      this.body.id_chat = chat_temp.idchat;
      this.body.titolo = formgroup.get("ModificaTitolo")?.value;
      this.chat_service.update_chat(this.body).subscribe(result =>{
        if(result.args.completed) {
        const index = this.list_chat.findIndex(chat => chat.idchat === chat_temp?.idchat);
          if (index !== -1) {
            this.list_chat[index].titolo = formgroup.get("ModificaTitolo")?.value;
          }
        }
    });
  }

   update_message_versione_corrente(id_message_now: string, id_message_back: string){
    this.body = Object();
        this.body.id_message_now = id_message_now;
        this.body.id_message_back = id_message_back;
      this.chat_service.update_message_versione_corrente(this.body).subscribe(result =>{
        if(result.args.completed) {
        }
    });
  }


  closeDropdown() {
    const dropdownMenu = document.querySelector('#dropdownChatMenu .dropdown-menu');
    if (dropdownMenu?.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  }



}
