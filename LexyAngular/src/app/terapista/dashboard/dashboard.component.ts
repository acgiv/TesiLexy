import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CaroselloComponent} from "../../carosello/carosello.component";
import {SocketService} from "./socket.service";
import {NgForOf} from "@angular/common";
import {Bambino, RiquestService} from "./riquest.service";
import {AccessService} from "../../access.service";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FaIconComponent,
    CaroselloComponent,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements  OnInit{
  list_user: Bambino[] = [];
  prova: { title: string, linkText: string }[]  = [];


  constructor(
               private socketService: SocketService,
               private  riquestDashBoard: RiquestService,
               private accessService:  AccessService) {
  }

  ngOnInit(): void {
      this.riquestDashBoard.RiquestChild({"id_terapista": this.accessService.getId()}).subscribe(data => {
       let bambino: Bambino;
        for(const element of data.response.list_child){
          bambino = {
            nome: element.nome,
            cognome: element.cognome,
            email: element.email,
            id_bambino: element.id_bambino,
            username: element.username,
            controllo_terapista: element.controllo_terapista,
            data_nascita: element.data_nascita,
            descrizione: element.descrizione,
            id_terapista: element.id_terapista,
            id_utente:element.id_utente,
            patologie:element.patologie,
            tipologia:element.tipologia,
            terapista_associati:element.terapista_associati
          }
          this.list_user.push(bambino)
        }
      })

      this.socketService.getMessage().subscribe((message: any) => {
        this.prova.push(message); // Aggiungi il campo corretto in base alla risposta del server
      });
    }

}
