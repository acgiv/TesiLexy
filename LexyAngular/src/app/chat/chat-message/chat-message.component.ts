import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ChatDirectiveDirective} from "../chat_directive/chat-directive.directive";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FaIconComponent,
    NgStyle,
    NgForOf
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
  @Input() isFromPepper: boolean = true;
  @Input() timestamp: string = "12:30 | 04 Mar";
  @Input() messageText: string = "";
  @Input() number_version: number | undefined;
  @Input() number_text: number | undefined;
  @Input() is_first_message: boolean | undefined;
  @Input() list_text:[string, string][] = []
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

constructor(protected chat_directive: ChatDirectiveDirective) {
}

  riproduzionePepper(){
    alert("Riproduzione Pepper");
  }

  RigeneraMessaggio(){
    alert("Rigenera Messaggio");
  }

  back(number_version: number) {
    if(number_version>0){
      this.number_version =number_version -1
      this.messageText= this.list_text[this.number_version][1]
      this.chat_directive.update_message_versione_corrente(this.list_text[this.number_version][0], this.list_text[this.number_version+1][0])
    }
  }

  up(number_version: number, number_text: number) {
     if(number_version<number_text){
      this.number_version = number_version +1;
      this.messageText= this.list_text[this.number_version][1];
      this.chat_directive.update_message_versione_corrente(this.list_text[this.number_version][0], this.list_text[this.number_version-1][0])
    }
  }
}
