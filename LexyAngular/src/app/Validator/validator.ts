import {FormControl, ValidatorFn} from "@angular/forms";

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
