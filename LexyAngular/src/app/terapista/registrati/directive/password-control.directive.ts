import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";


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
  constructor() { }

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

  color_progress(percent: number){
    if(percent<=32){
      return "red"
    }else if(percent <64){
      return "orange"
    }else if(percent<70){
      return "lightgreen"
    }else if(percent<90){
      return "green"
    }else{
      return 'darkgreen';
    }
  }

  validate(control: AbstractControl): {[key: string]: any}  | null {
     let len_password = control.value ? control.value.length : 0;
     let percent =  this.control_security(control.value, len_password);
      return { 'invalidPassowrd': percent===0 || len_password <=7  , 'validate': percent, "massage_error": this.message_error(len_password), "progress_color": this.color_progress(percent)};
  }

}
