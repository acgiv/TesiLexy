import {AbstractControl, FormControl, ValidatorFn} from "@angular/forms";




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

export function multiPatternValidatorSelect(placeholder:string, errorKey: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.value) {
          return null;
    }

   if (Array.isArray(control.value) && control.value.length === 1 && control.value[0] === placeholder) {
      return { [errorKey]: true };
   }
    return null;
  };
}


export function dataValidator( errorKey: string,  anni: number, current_date:Date): ValidatorFn {
  // @ts-ignore
  return (control: FormControl) => {
    const splitted = Number(control.value.split("-", 1)[0]);
    if(splitted>= current_date.getFullYear()-anni){
       return { [errorKey]: true };
    } else {
      return null;
    }
  };
}



