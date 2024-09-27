import {Component, Input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormInput} from "../../form";

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent,
    NgIf,
    NgbTooltip,
    NgClass,
    NgForOf
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent {
  @Input() elem!: FormInput;
  @Input() formGroup!: FormGroup;
  @Input() submit!: boolean;

  protected readonly faInfoCircle = faInfoCircle;

  getIconClasses(elem: FormInput) {
      return {
        [String(elem.label.emojiInfo?.class)]: true, // Usa la variabile per la classe
        'me-2': elem.label.emojiInfo?.is_position === 'end',
        'ms-2': elem.label.emojiInfo?.is_position !== 'end',
      };
  }

    getErrors(controlName: string): { [key: string]: boolean } | null {
      const control = this.formGroup.get(controlName);
      if ((control?.touched || control?.dirty || this.submit) && control?.errors) {
        return control.errors;
      }
      return null;
    }


  protected readonly Object = Object;
  protected readonly String = String;
}
