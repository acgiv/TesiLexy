import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {urlValidator} from "../Validator/validator";


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

  constructor(private router: Router) {
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
    this.isLoginActive = this.isActive('/login') || this.isActive('/terapista/login');
    this.isSignUpActive = this.isActive('/signup') || this.isActive('/terapista/signup');
  }


 isTerapista(): boolean {
   const pattern = /\/terapista/; // Definisci il pattern regolare
    return  new FormControl(this.router.url, [Validators.required, urlValidator(pattern)]).errors != null;
  }

  isActive(route: string): boolean {
    return  this.router.url === route;
  }

}
