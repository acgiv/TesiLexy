import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { register } from 'swiper/element/bundle';
import {Router} from "@angular/router";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Testo} from "../../testo/testo.service";
import {RiquestService} from "../riquest.service";

register();

@Component({
  selector: 'app-carosello_testo_spiegato',
  standalone: true,
  imports: [NgForOf, NgClass, FaIconComponent, NgIf],
  templateUrl: './carosello_testo_spiegato.component.html',
  styleUrls: ['./carosello_testo_spiegato.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarosellotestospiegatoComponent implements AfterViewInit,  OnInit{
  @Input() sectionTitle!: string;
  @Input() buttonText!: string;
  @Input() contentList!: Testo[];

  @ViewChild('swiperContainer', { static: true }) swiperContainer!: ElementRef;

  constructor(private router: Router,
              private riquestDashBoard: RiquestService,
              ) {
  }

  ngOnInit() {
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
    let body = Object();
      body.tipologia = 'testo_originale';
      body.limite = null;
      this.riquestDashBoard.request_text(body).subscribe({
      next: (data) => {
        console.log(data.child)
        this.router.navigate(["/terapista/dashboard/visualizzaTestoAdattato"], {
          state: {
            lista: data['args']['response']['text'],
            id_testo: element.id_testo,
            Titolo: element.titolo,
            Materia: element.materia,
            Testo: element.testo,
            Eta: element.eta_riferimento,
            chile_list: element.child,
            id_testo_spiegato: element.id_testo_spiegato
          }
        }).then(() => {
        });
      }  , error: () => {
        this.router.navigate(["/terapista/dashboard/visualizzaTestoAdattato"], {
          state: {}
        }).then(() => {
          console.log("Navigazione avvenuta con successo");
        });
      },
      });
  }


crea_testo() {
      let body = Object();
      body.tipologia = 'testo_originale';
      body.limite = null;
      this.riquestDashBoard.request_text(body).subscribe({
      next: (data) => {
        this.router.navigate(["terapista/dashboard/inserisciTestoAdattato"], {
          state: {
            lista: data['args']['response']['text'],
            navigatedByButton: true

          }
        }).then(() => {
        });
      }  , error: () => {
        this.router.navigate(["terapista/dashboard/inserisciTestoAdattato"], {
          state: {navigatedByButton: true}
        }).then(() => {});
      },
      });
}
  protected readonly faPlus = faPlus;
}
