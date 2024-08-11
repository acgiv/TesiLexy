import {AbstractControl, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import { Subscription } from 'rxjs';



export function urlValidator(pattern: RegExp): ValidatorFn {
  // @ts-ignore
  return (control: FormControl) => {
    const currentUrl = control.value;
    if (currentUrl && pattern.test(currentUrl)) {
      return null;
    } else {
      return {invalidUrl: true}; // Errore se l'URL corrente non soddisfa il pattern regolare
    }
  };
}

interface PatternWithError {
  pattern: RegExp;
  errorKey: string;
}

export function multiPatternValidator(patterns: PatternWithError[]): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.value) {
      return null;
    }
    for (let patternWithError of patterns) {
      if (!patternWithError.pattern.test(control.value)) {
        return { [patternWithError.errorKey]: true };
      }
    }
    return null;
  };
}





