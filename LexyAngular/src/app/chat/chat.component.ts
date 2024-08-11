import {Component, HostListener} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ChatMessageComponent} from "./chat-message/chat-message.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgStyle,
    NgClass,
    ChatMessageComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  isOpen = true;
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  ngOnInit() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize.bind(this));
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkWindowSize.bind(this));
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    const windowWidth = window.innerWidth;
    this.isOpen = windowWidth >= 768;
  }


  viewText(){
    alert("Render Chat");
  }

  deleteChat(){
    alert("Chat Eliminata");
  }

  renameChat(){
    alert("Chat Rinominata");
  }

  newChat(){
    alert("Nuova Chat");
  }
}
