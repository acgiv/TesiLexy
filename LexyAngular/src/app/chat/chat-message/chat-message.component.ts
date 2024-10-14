import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {faChevronLeft, faChevronRight, faHeart, faRobot, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ChatDirectiveDirective} from "../chat_directive/chat-directive.directive";
import {Message} from "../chat-service.service";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FaIconComponent,
    NgStyle,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css',
  changeDetection:ChangeDetectionStrategy.Default
})
export class ChatMessageComponent implements OnInit{
  @Input() is_first_message: boolean | undefined;
  @Input() message: Message;
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;
  protected like:boolean = false ;
  protected message_text: string = '';
  protected isFromPepper: boolean = true;
  protected number_text: number =0;
  protected number_version: number =0;
constructor(protected chat_directive: ChatDirectiveDirective)  {
  this.message=  {
    versione_corrente: 1,
    index_message: "22000",
    tipologia: "",
    versione_messaggio: "1",
    data_creazione: "",
    id_messaggio: "",
    testo: [['', ""]],
    like:0
  };
}

ngOnInit() {
  this.message_text =  this.message.testo[Number(this.message.versione_corrente)-1][1];
  this.isFromPepper = this.message.tipologia=='messaggio_pepper';
  this.number_text = Number(this.message.testo.length)
  this.number_version = Number(this.message.versione_corrente)-1
}


  back(number_version: number) {
    if(number_version>0){
      this.number_version =number_version -1
      this.message_text = this.message.testo[this.number_version][1]
      this.chat_directive.update_message_versione_corrente(this.message, this.message.testo[this.number_version][0], this.message.testo[this.number_version+1][0])
    }
  }

  up(number_version: number, number_text: number) {
     if(number_version<number_text){
      this.number_version = number_version +1;
      this.message_text= this.message.testo[this.number_version][1];
      this.chat_directive.update_message_versione_corrente(this.message, this.message.testo[this.number_version][0], this.message.testo[this.number_version-1][0])
    }
  }

  protected readonly faSyncAlt = faSyncAlt;
  protected readonly faRobot = faRobot;
  protected readonly faHeart = faHeart;

  like_message(number_version: number) {
    this.message.like = this.message.like == 1? 0:1
    this.chat_directive.update_message(this.chat_directive.index_select_chat,
      this.message.tipologia,
      this.message_text,
      this.message.like, this.message.testo[number_version][0])
  }
  riproduzionePepper(){
    alert("Riproduzione Pepper");
  }

  RigeneraMessaggio(){
  let testo_messaggio_user = this.read_message_text_user();
  let number_version_active = JSON.parse(JSON.stringify(this.number_version));
  let id_active_message = this.message.testo[number_version_active][0];
  this.message.testo.push([this.message.id_messaggio ?? '', 'Sto scrivendo...']);
  this.message.versione_messaggio = this.message.versione_messaggio + 1;
  this.number_version = this.message.testo.length - 1;
  this.number_text = this.message.testo.length;
  this.like = this.message.like ==0;
  this.like  = false;
  this.chat_directive.reload_message(testo_messaggio_user, id_active_message, this.message);
  }


  read_message_text_user() {
    if (this.chat_directive.list_chat && this.chat_directive.index_select_chat !== undefined && this.chat_directive.list_chat[this.chat_directive.index_select_chat]) {
      let lista = this.chat_directive.list_chat[this.chat_directive.index_select_chat ?? 0].message;
      if (lista != undefined) {
        const index = lista.findIndex(
          (element: Message) => element.index_message === this.message.index_message
        )
        return  lista[index - 1].testo[0][1]
      }
    }
    return ''
  }
  protected readonly Number = Number;
}
