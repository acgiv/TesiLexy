import { Injectable } from '@angular/core';
import {cloneDeep} from "lodash";

@Injectable({
  providedIn: 'root'
})
export class StringUtilsService {

   /**
   * Confronta una stringa di base con una o più altre stringhe, ignorando maiuscole e minuscole.
   * Restituisce true se la base è uguale a uno degli altri valori, ignorando maiuscole/minuscole.
   * @param base La stringa di base da confrontare (può essere null).
   * @param others Le stringhe con cui confrontare la stringa base (possono essere null).
   * @returns true se base è uguale a uno degli others (case-insensitive), altrimenti false.
   */
  equalsAnyIgnoreCase(base: string | null, ...others: (string | null)[]): boolean {
    if (base === null) {
      return others.some(value => value === null);
    }
    return others.some(value => value !== null && base.toLowerCase() === value.toLowerCase());
  }

  compareArrays = (a:[], b:[]) => {
    return (a!= undefined && b!=undefined )
      && (a.length == b.length)
      &&  JSON.stringify(cloneDeep(a).sort()) === JSON.stringify(cloneDeep(b).sort());
  };
}
