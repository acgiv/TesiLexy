import { Directive } from '@angular/core';

@Directive({
  selector: '[appDashboard]',
  standalone: true
})
export class DashboardDirective {
  element_carosello;
  constructor() {
    this.element_carosello =
    [
      {
        titolo: "I miei pazienti",
        titolo_button: "Nuovo Paziente",
        navigazione_card:"/terapista/dashboard/visualizzaPaziente",
        navigazione_button:"terapista/dashboard/inserisciPaziente"
      },
     {
        titolo: "Testi non spiegati",
        titolo_button: "Nuovo Testo",
        navigazione_card:"/terapista/dashboard/visualizzaTesto",
        navigazione_button:"terapista/dashboard/inserisciTesto"
      }
    ]
  }

}
