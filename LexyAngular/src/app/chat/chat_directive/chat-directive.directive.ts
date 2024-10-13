import {ChangeDetectorRef, Directive} from '@angular/core';
import {AccessService} from "../../access.service";
import {ChatList, ChatServiceService, Message} from "../chat-service.service";
import {FormGroup} from "@angular/forms";

@Directive({
  selector: '[appChatDirective]',
  standalone: true
})
export class ChatDirectiveDirective{

  list_chat: ChatList[];
  index_select_chat:number=0;
  protected body: any;
  constructor( private access_service:  AccessService, protected chat_service :ChatServiceService , private cdr: ChangeDetectorRef) {
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

   update_message_versione_corrente(message: Message, id_message_now: string, id_message_back: string){
    this.body = Object();
      this.body.id_message_now = id_message_now;
      this.body.id_message_back = id_message_back;
      this.chat_service.update_message_versione_corrente(this.body).subscribe(result =>{
        if(result.args.completed){
          message.like = result.args.response.message.like;
          console.log(message)
          this.cdr.detectChanges();
        }
      });
  }

   result_chat_gpt(id_chat: string, testo_da_spiegare: string, index_chat: number){
        let list: ChatList = this.list_chat[index_chat]??[];
        const number = this.list_chat[index_chat].message?.length??0
        this.body = Object();
        this.body.id_bambino = this.access_service.getId();
        this.body.id_chat = id_chat;
        this.body.testo_da_spiegare = testo_da_spiegare;
        this.chat_service.result_chat_gpt(this.body).subscribe(result => {
        if (result.args.completed && list?.message?.[number-1]) {
            list.message?.pop()
            list.message?.push(result.args.response.message)
        }

  });
  }

  create_body_message(index_chat: number, tipologia: string, testo: string, like:number =0){
      this.body = Object();
      this.body.id_chat= this.list_chat[index_chat].idchat;
      this.body.id_bambino = this.access_service.getId();
      this.body.tipologia = tipologia;
      this.body.testo= testo;
      this.body.like = like;
      return this.body;
  }


  insert_message(index_chat: number, tipologia: string, testo: string, befor_chat:boolean =false){
      this.body = this.create_body_message(index_chat, tipologia, testo);
      const list = this.list_chat[index_chat];
      this.chat_service.insert_message(this.body).subscribe(result =>{
        if(result.args.completed && this.list_chat[index_chat]) {
          const message: Message = {
            testo: [[this.body.id_bambino, testo]],
            versione_corrente: result.args.response.message.versione_corrente,
            id_messaggio: result.args.response.message.id_messaggio,
            versione_messaggio: result.args.response.message.versione_messaggio,
            data_creazione: result.args.response.message.data_creazione,
            tipologia: result.args.response.message.tipologia,
            index_message: result.args.response.message.index_message,
            like: result.args.response.message.like
          }
          if (list != undefined) {
            list.number_all_message = (list.number_all_message ?? 0) + 1;
            list.message?.push(message)
            if (befor_chat){
              list.number_all_message = (list.number_all_message ?? 0) + 1;
              list.message?.push(this.set_message_load())
            }
          }
        }
      });
  }

  update_message(index_chat: number, tipologia: string, testo: string, like:number, id_messaggio: string){
     this.body = this.create_body_message(index_chat, tipologia, testo, like);
     this.body.id_messaggio = id_messaggio;
     this.chat_service.update_message(this.body).subscribe(_ =>{
      });
  }


    reload_message(testo_messaggio_user:string , id_message_attive: string ,message: Message){
      let lista = this.list_chat[this.index_select_chat ?? 0].message;
     this.body = Object();
     this.body.id_messaggio_active = id_message_attive;
     this.body.id_message_reload = message.id_messaggio;
     this.body.id_bambino = this.access_service.getId();
     this.body.testo_user = testo_messaggio_user;
     this.chat_service.reload_message(this.body).subscribe(result =>{
        if(result.args.completed) {
          message.testo.pop(); // Rimuovi l'ultimo testo temporaneo
          if (lista != undefined) {
            const index = lista.findIndex(
              (element: Message) => element.index_message === message.index_message
            );
            message.testo.push(result.args.response.message.testo[0]); // Aggiungi il nuovo testo
            lista[index].versione_corrente = message.testo.length - 1;
            this.cdr.detectChanges();
          }
        }

     });

  }



  set_message_load(){
    let message: Message = {
      versione_corrente:1,
      index_message:"22000",
      tipologia:"messaggio_pepper",
      versione_messaggio: "1",
      data_creazione:"",
      id_messaggio:"",
      like:0,
      testo:[[this.access_service.getId(), "sto scrivendo"]]
    }
    return message
  }

  closeDropdown() {
    const dropdownMenu = document.querySelector('#dropdownChatMenu .dropdown-menu');
    if (dropdownMenu?.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  }



find_id_message(id_message:string ) {
    if (this.list_chat && this.index_select_chat !== undefined && this.list_chat[this.index_select_chat]) {
      let lista = this.list_chat[this.index_select_chat ?? 0].message;
      if (lista != undefined) {
        return  lista.findIndex(
          (element: Message) => element.index_message === id_message)
      }
    }
    return -1
  }

  protected readonly Number = Number;

}
