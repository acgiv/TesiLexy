import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {RegisterService} from "../service/register.service";


@Directive({
  selector: '[appPasswordControl]',
  standalone: true,
   providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordControlDirective,
    multi: true
  }]
})
export class PasswordControlDirective implements Validator {
  @Input('appFormControl') pattern: string | undefined;
  @Input("typeInput") typeInput: string | undefined;
  constructor(private registerService: RegisterService) { }

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

  message_error(len_password: number){
    if(len_password==0){
       return 'La password non può essere vuota';
    }else {
      return 'La password deve contenere almeno 8 caratteri';
    }
  }

  validate(control: AbstractControl): {[key: string]: any}  | null {
     let len_password = control.value ? control.value.length : 0;
     let percent =  this.control_security(control.value, len_password);
     let result =  percent===0 || len_password <=7;
      this.registerService.value_error_password = result;
      this.registerService.value_percent_password= percent;
      if(result ){
         return { 'invalidPassowrd': result,  "massage_error": this.message_error(len_password)};
      }
      return null;

  }

}
