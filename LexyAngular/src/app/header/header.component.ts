import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {urlValidator} from "../form/Validator/validator";
import {AccessService} from "../access.service";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isHomeActive: boolean = false;
  isLoginActive: boolean = false;
  isSignUpActive: boolean = false;
  isChatActive: boolean = false;
  isRegistrationActive: boolean = false;
  isNavbarOpen:boolean = false;
  isDashboardActive: boolean = false;
  clickable: boolean = false;


  constructor(private router: Router, protected accessService: AccessService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveLinks();
      }
    });
  }
 updateActiveLinks() {
  this.isHomeActive = this.isActive('/') || this.isActive('/terapista');
  this.isLoginActive = this.isActive('/login') ||
    this.isActive('/terapista/login') ||
    this.isActive('/recuperoPassword') ||
    this.isActive('/terapista/recuperoPassword');
  this.isSignUpActive = this.isActive('/signup') || this.isActive('/terapista/signup');
  this.isChatActive = this.isActive('/chat') || this.isActive('/terapista/chat');
  this.isDashboardActive = this.isActive('/terapista/dashboard') ||
    this.isActive('/terapista/dashboard/inserisciPaziente') ||
    this.isActive('/terapista/dashboard/inserisciTesto') ||
    this.isActive('/terapista/dashboard/visualizzaPaziente') ||
    this.isActive('/terapista/dashboard/visualizzaTestoAdattato') ||
    this.isActive('/terapista/dashboard/inserisciTestoAdattato') ||
    this.isActive('/terapista/dashboard/visualizzaTesto');
  this.isRegistrationActive = this.isActive('/terapista/registrati');
}


  isTerapista(): boolean {
    const pattern = /\/terapista/; // Definisci il pattern regolare
    return new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  exit() {
    this.accessService.resetAccess()
     this.router.navigate([this.router.url.split("/").at(1) == 'terapista'?"/terapista": "/" ]).then(() => {});
  }

  closeOption() {
    this.clickable= !this.clickable
  }


  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
    console.log(this.isNavbarOpen);
  }

  setState(url: string) {
     this.router.navigate([url], {
       state: {navigatedByButton: true}
     }).then(_ =>{} );
  }
}
