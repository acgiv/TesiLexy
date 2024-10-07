import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {Subscription} from "rxjs";
import { FormInput} from "../form";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import {StringUtilsService} from "../../Utilitys/string-utils.service";
@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    ReactiveFormsModule,
    FaIconComponent,
    NgbTooltip,
    JsonPipe,
  ],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
  encapsulation: ViewEncapsulation.None
})
export class InputSelectComponent implements OnInit{
   @Input() elem!: FormInput;
   @Input() list_elem! :string[];
   @Input() formGroup!: FormGroup;
   @Input() submit!:boolean;
   protected clickablePatologia : boolean = false;
   private subscription: Subscription = new Subscription();
   private elementFocused: string ='';
   protected readonly faClose = faClose;
   protected readonly faInfoCircle = faInfoCircle;
   protected readonly Object = Object;
   protected readonly String = String;
   private search_name: any;
   private component_name: any;
   @Output() indexSelected: EventEmitter<number> = new EventEmitter<number>();


   constructor(private string_utils :StringUtilsService) {
    }

  ngOnInit() {
    this.search_name = 'search'+this.elem.input.name;
    this.component_name = this.elem.input.name;

    const control = this.formGroup.get(this.search_name);
    if (control) {
      this.subscription.add(
        control.valueChanges.subscribe((input: string ) => {
          const filtered = this.list_elem.filter((pa: string | null) => pa != null)
          .filter((pa: string) => pa.toLowerCase().includes(input.toLowerCase()));
          if (filtered.length >= 1 && input.length != 0) {
            if (this.elementFocused != filtered[0] && input.length != 0) {
              this.removeFocusedSearch(this.elementFocused);
              const element = document.getElementById(filtered[0]);
              this.elementFocused = filtered[0];
              element?.classList.add('focused');
            } else if (input.length === 0) {
              this.removeFocusedSearch(this.elementFocused);
            }
          }
        })
     );
    }
  }



  removeFocusedSearch(elementFocus :string){
     const element = document.getElementById(elementFocus);
     element?.classList.remove('focused');
     this.elementFocused ='';
  }

   selectItem() {
    this.clickablePatologia = !this.clickablePatologia;
    this.removeFocusedSearch(this.elementFocused);
    this.formGroup.get(this.search_name)?.setValue("");
    this.formGroup.get(this.component_name)?.markAsTouched();
    this.formGroup.get(this.component_name)?.updateValueAndValidity()

  }

  selectItemListMenu(patologia: string, index: number) {
    this.formGroup.get(this.component_name)?.markAsDirty();
    this.selectItemMenu(patologia,this.formGroup.get(this.component_name)?.value);
    this.clickablePatologia = false;
    this.formGroup.get(this.search_name)?.setValue("");
    this.indexSelected.emit(index);
  }

  selectItemMenu(item: any, lista: any): void {
    const itemIndex = lista.indexOf(item);
    if (itemIndex !== -1) {
      lista.splice(itemIndex, 1);
    } else {
      const dashIndex = lista.indexOf(this.elem.input.placeholder);
      if (dashIndex !== -1) {
        lista.splice(dashIndex, 1);
      }
      if (this.elem.input.multi_select){
         lista.push(item);
      }else{
        lista.length = 0;
        lista.push(item)
      }

    }

    if (lista.length === 0) {
      lista.push(this.elem.input.placeholder);
    }
     this.formGroup.get(this.component_name)?.updateValueAndValidity();
  }

  removeSelect(patologia: any) {
    this.selectItemMenu(patologia,this.formGroup.get(this.component_name)?.value);
    this.clickablePatologia = !this.clickablePatologia;
  }

  onKeydown(event: KeyboardEvent) {
    if(event.key === "Enter"){
        event.preventDefault();
        let elem = this.formGroup.get(this.search_name)?.value;
        elem = this.string_utils.capitalize(elem);
        this.selectItemMenu(elem,this.formGroup.get(this.component_name)?.value);
        this.clickablePatologia = !this.clickablePatologia;
        if(!this.elem.input.multi_select){
          this.list_elem.push(elem);
        }
    }
  }

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

   protected get_element_name_form() {
     return this.elem.input.placeholder ? this.elem.input.placeholder : ''
   }
}
