import {Directive, Input} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, Validator, Validators} from "@angular/forms";
import {urlValidator} from "../../../Validator/validator";
import {RegisterService} from "../service/register.service";


@Directive({
  selector: '[appFormControl]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: FormControlDirective,
    multi: true
  }]
})
export class FormControlDirective implements Validator{
  @Input('appFormControl') pattern: string | undefined;
  @Input("typeInput") typeInput: string | undefined ;
  message_error: string;
  constructor(private registerService: RegisterService) {
    this.message_error = "";
  }

  validate(control: AbstractControl): {[key: string]: any}  | null {
    if (this.pattern === undefined) {
      return null;
    }
    if (control.value?.length===0){
      console.log("sono qui ", this.typeInput);
       this.registerService.set_control_register(true, this.typeInput);
       this.registerService.set_message_register( "Il campo "+ this.typeInput+ " non può essere vuoto!", this.typeInput);
    }else{
      let result=  new FormControl(control.value, [Validators.required, urlValidator(new RegExp(this.pattern))]).errors != null;
      this.registerService.set_control_register(result, this.typeInput);
       this.registerService.set_message_register( "Il formato dell' "+ this.typeInput+ " non è corretto!", this.typeInput);
      if (result ) {
        return { 'invalidPattern': result};
      }
    }

    return  null;
  }

}
