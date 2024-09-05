import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TerapistaService} from "../../terapista/terapista.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {Subscription} from "rxjs";
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
  ],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
  encapsulation: ViewEncapsulation.None
})
export class InputSelectComponent implements OnInit {
   @Input() formGroup!: FormGroup;
   @Input() submit!:boolean;
   protected clickablePatologia : boolean = false;
   private subscription: Subscription = new Subscription();
   private elementFocused: string ='';

   constructor(protected terapistaService: TerapistaService,private fb: FormBuilder) {
    }


  ngOnInit() {
    this.formGroup = this.fb.group({
      patologie: new FormControl(['Patologie']),
      search: [''],// Inizializza il controllo
    });

    const control = this.formGroup.get('search');
    if (control) {
      this.subscription.add(
        control.valueChanges.subscribe((input: string) => {
          const filtered = this.terapistaService.patologie.filter(pa => pa.toLowerCase().includes(input.toLowerCase()));
          if (filtered.length >= 1 && input.length!=0) {
            if(this.elementFocused!=filtered[0] && input.length!=0){
             const element = document.getElementById(this.elementFocused);
             element?.classList.remove('focused');
            }
              const element = document.getElementById(filtered[0]);
              this.elementFocused=filtered[0];
              element?.classList.add('focused');
            } else if(input.length===0){
               const element = document.getElementById(this.elementFocused);
               element?.classList.remove('focused');
               this.elementFocused ='';
            }

        })
     );
    }
  }

   selectPatologia() {
    this.clickablePatologia = !this.clickablePatologia;
  }

  selectItemPatologia(patologia: string) {
    this.selectItemMenu(patologia,this.formGroup.get('patologie')?.value);
     this.clickablePatologia = false;
  }


  selectItemMenu(item: any, lista: any): void {
    const itemIndex = lista.indexOf(item);
    if (itemIndex !== -1) {
      lista.splice(itemIndex, 1);
    } else {
      const dashIndex = lista.indexOf("Patologie");
      if (dashIndex !== -1) {
        lista.splice(dashIndex, 1);
      }
      lista.push(item);
    }

    if (lista.length === 0) {
      lista.push("Patologie");
    }
  }


  protected readonly faClose = faClose;

  removeSelect(patologia: any) {
    this.selectItemMenu(patologia,this.formGroup.get('patologie')?.value);
  }


}
