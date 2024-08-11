import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormInput} from "../form";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bar-security-password',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './bar-security-password.component.html',
  styleUrl: './bar-security-password.component.css'
})
export class BarSecurityPasswordComponent implements OnInit, OnDestroy{
     @Input() formGroup!: FormGroup;
     @Input() inputComponent! : FormInput;
     @Input() submit!: boolean;
     protected percent_password: number;
     private subscription: Subscription = new Subscription(); // lo utilizzo per controllare i cambiamenti del inputComponent
     constructor() {
       this.percent_password = 0;
     }
     ngOnInit() {
          const control = this.formGroup.get(this.inputComponent.input.name);
          if (control) {
            this.subscription.add(
            control.valueChanges.subscribe((input: string) => {
            const len_password = input ? input.length : 0;
            this.percent_password = this.control_security(input, len_password);
            })
               );
          }
     }

     control_security(password: string, len_password :number): number{
        let cont = 0;
        if (len_password !== 0) {
          if (len_password > 8) {
              cont += 16.0;
          } else {
              cont += len_password * 2;
          }
          if (password.search(/^(?=.*[A-Z]).*$/) === 0) {
              cont += 16.0;
          }
          if (password.search(/^(?=.*[a-z]).*$/) === 0) {
              cont += 16.0;
          }
          if (password.search(/^(?=.*[\W_]).*$/) === 0) {
              cont += 16.0;
          }
          if (password.search(/^.{10,100}$/) === 0) {
              cont += 16.0;
          }
          if (password.search(/^(?=.*\d).*$/) === 0) {
              cont += 16.0;
          }
      }
      if (cont === 96) {
          cont = 100;
      }
        return cont;
    }

    color_progress() {
      if (this.percent_password <= 32) {
        return "red"
      } else if (this.percent_password < 64) {
        return "orange"
      } else if (this.percent_password < 70) {
        return "lightgreen"
      } else if (this.percent_password < 90) {
        return "green"
      } else {
        return 'darkgreen';
      }
    }

      ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


}
