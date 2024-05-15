import {Directive, Input} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, Validator, Validators} from "@angular/forms";
import {urlValidator} from "../../../Validator/validator";


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
  constructor() { }

  validate(control: AbstractControl): {[key: string]: any}  | null {
    if (!this.pattern) {
      return null;
    }
    if (new FormControl(control.value, [Validators.required, urlValidator(new RegExp(this.pattern))]).errors != null ) {
      return { 'invalidPattern': true };
    }
    return  null;
  }

}
