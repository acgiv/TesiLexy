import {Component, Input} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FaIconComponent,
    NgStyle
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
  @Input() isFromPepper: boolean = true;
  @Input() timestamp: string = "12:30 | 04 Mar";
  @Input() messageText: string = "";
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;


  riproduzionePepper(){
    alert("Riproduzione Pepper");
  }

  RigeneraMessaggio(){
    alert("Rigenera Messaggio");
  }
}
