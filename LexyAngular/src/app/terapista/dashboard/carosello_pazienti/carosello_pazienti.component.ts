import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { register } from 'swiper/element/bundle';
import {Router} from "@angular/router";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Bambino} from "../riquest.service";

register();

@Component({
  selector: 'app-carosello_pazienti',
  standalone: true,
  imports: [NgForOf, NgClass, FaIconComponent, NgIf],
  templateUrl: './carosello_pazienti.component.html',
  styleUrls: ['./carosello_pazienti.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CaroselloPazientiComponent implements AfterViewInit {
  @Input() sectionTitle!: string;
  @Input() buttonText!: string;
  @Input() contentList!: Bambino[];

  @ViewChild('swiperContainer', { static: true }) swiperContainer!: ElementRef;

  constructor(private router: Router) {
  }
  ngAfterViewInit(): void {
    const swiperElement = this.swiperContainer.nativeElement;

    const swiperOptions = {
      slidesPerView: 4,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragSize: 50
      },
      injectStyles: [
        `:host .swiper-scrollbar-drag {background-color: #000000;}`,
        `:host .swiper-wrapper {margin-bottom: 45px;}`,
        `:host .swiper-scrollbar {background-color: #D9D9D9; border-radius: 2px; height: 8px;}`,
      ],
      breakpoints: {
        1920: { slidesPerView: 4 },
        992: { slidesPerView: 3 },
        694: { slidesPerView: 2 },
        320: { slidesPerView: 1 }
      }
    };
    Object.assign(swiperElement, swiperOptions);
    swiperElement.initialize();
  }

  visualizza_pazienti(paziente: Bambino) {
     this.router.navigate(["/terapista/dashboard/visualizzaPaziente"],{
       state: {
          nome: paziente.nome,
          cognome: paziente.cognome,
          email: paziente.email,
          id_bambino: paziente.id_bambino,
          username: paziente.username,
          controllo_terapista: paziente.controllo_terapista,
          data_nascita: paziente.data_nascita,
          descrizione: paziente.descrizione,
          id_terapista: paziente.id_terapista,
          patologie: paziente.patologie, // Potresti dover serializzare meglio questo campo
          tipologia: paziente.tipologia,
          terapista_associati: paziente.terapista_associati,
          navigatedByButton: true
       }
     }).then(() => {});
  }
  crea_pazienti() {
     this.router.navigate(["terapista/dashboard/inserisciPaziente"],  {state: {navigatedByButton: true}}).then(() => {});
  }
  protected readonly faPlus = faPlus;

}
