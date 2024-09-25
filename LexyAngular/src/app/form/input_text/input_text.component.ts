import {Component, Input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormInput} from "../form";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {InputPasswordService} from "../input service/inputpassword.service";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {BarSecurityPasswordComponent} from "../bar-security-password/bar-security-password.component";
import {keyframes} from "@angular/animations";

@Component({
  selector: 'app-input_text',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    FaIconComponent,
    NgClass,
    NgbTooltip,
    BarSecurityPasswordComponent,
    NgStyle,
    NgForOf
  ],
  templateUrl: './input_text.component.html',
  styleUrl: './input_text.component.css'
})
export class InputTextComponent {
  @Input() elem!: FormInput;
  @Input() formGroup!: FormGroup;
  @Input() submit!: boolean;
  protected readonly faExclamationCircle = faExclamationCircle;
  protected readonly faInfoCircle = faInfoCircle;
  protected readonly Number = Number;
  protected readonly keyframes = keyframes;
  protected readonly String = String;
  protected readonly Object = Object;

  constructor(protected inPassService: InputPasswordService) {

  }

    getClassPositionEmoji(elem: FormInput){
      if(elem.insertEmoji){
        if (elem.positionEmoji === "right"){
          return 'emoji emoji-right'
        }else{
          return 'emoji emoji-left'
        }
      }
      return "";
    }

    getIconClasses(elem: FormInput) {
      return {
        [String(elem.label.emojiInfo?.class)]: true, // Usa la variabile per la classe
        'me-2': elem.label.emojiInfo?.is_position === 'end',
        'ms-2': elem.label.emojiInfo?.is_position !== 'end',
      };
  }

}
