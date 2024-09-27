import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CaroselloComponent} from "../../form/carosello/carosello.component";
import {SocketService} from "./socket.service";
import {NgForOf} from "@angular/common";
import {Bambino, RiquestService} from "./riquest.service";
import {AccessService} from "../../access.service";
import {DashboardDirective} from "./dashboard.directive";


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

  constructor(
               private socketService: SocketService,
               private  riquestDashBoard: RiquestService,
               private accessService:  AccessService,
               protected directiveCarosello: DashboardDirective
  ) {

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

      this.socketService.getMessage().subscribe((element: any) => {
        console.log(element);
        const email = this.accessService.getEmail();
         const terapisti = Object.keys(element.terapista_associati);
         const bambino = {
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
              terapista_associati: terapisti
            }
         if (element.operazione =="insert"){
            if(terapisti.some(x => x === email)) {
              this.list_user.push(bambino);
            }
          }else if (element.operazione =="update"){
            const bambino2 = this.list_user.find(x => x.email === bambino.email);
            const is_accosciato = terapisti.some(x => x === email);
            console.log(bambino2, is_accosciato, terapisti)
             if (bambino2 && is_accosciato) {
               bambino2.nome = element.nome;
               bambino2.cognome = element.cognome;
               bambino2.email = element.email;
               bambino2.id_bambino = element.id_bambino;
               bambino2.username = element.username;
               bambino2.controllo_terapista = element.controllo_terapista;
               bambino2.data_nascita = element.data_nascita;
               bambino2.descrizione = element.descrizione;
               bambino2.id_terapista = element.id_terapista;
               bambino2.id_utente = element.id_utente;
               bambino2.patologie = element.patologie;
               bambino2.tipologia = element.tipologia;
               bambino2.terapista_associati = terapisti;
             }else if (bambino2 && !is_accosciato && terapisti.length==0){
               this.list_user = this.list_user.filter(x => x.email!== bambino2.email);
              }else if (!bambino2 && is_accosciato && terapisti.length>0) {
               const bambino = {
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
                  terapista_associati: terapisti
                }
               this.list_user.push(bambino);
             }
         }
      });
    }

}
