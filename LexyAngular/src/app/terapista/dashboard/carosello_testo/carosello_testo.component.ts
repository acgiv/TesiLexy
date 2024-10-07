import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { register } from 'swiper/element/bundle';
import {Router} from "@angular/router";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Testo} from "../../testo/testo.service";

register();

@Component({
  selector: 'app-carosello_testo',
  standalone: true,
  imports: [NgForOf, NgClass, FaIconComponent, NgIf],
  templateUrl: './carosello_testo.component.html',
  styleUrls: ['./carosello_testo.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarosellotestoComponent implements AfterViewInit, OnDestroy{
  @Input() sectionTitle!: string;
  @Input() buttonText!: string;
  @Input() contentList!: Testo[];

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

  visualizza_testo(element: Testo) {
     this.router.navigate(["/terapista/dashboard/visualizzaTesto"], {
        state: {
          id_testo: element.id_testo,
          Titolo: element.titolo,
          Materia: element.materia,
          Testo: element.testo,
          Eta: element.eta_riferimento
        }
     }).then(() => {});
  }
  protected readonly faPlus = faPlus;

  crea_testo() {
    this.router.navigate(["terapista/dashboard/inserisciTesto"]).then(() => {});
  }


  ngOnDestroy(): void {
        // Puoi lasciare questo metodo vuoto se non hai risorse da liberare
  }
}
