import { Directive } from '@angular/core';
import {Testo} from "../testo/testo.service";

@Directive({
  selector: '[appDashboard]',
  standalone: true
})
export class DashboardDirective {
   lista_text_original: Testo[];
  constructor() {
    this.lista_text_original = [];
  }

}
