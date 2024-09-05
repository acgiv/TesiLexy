import {Component, ViewEncapsulation} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        FaIconComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  protected readonly faPlus = faPlus;
  constructor( private router: Router) {
  }
  createBambino() {
     this.router.navigate(['/terapista/dashboard/inserisciPaziente']).then(() => {});
  }
}
