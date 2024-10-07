import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegistratiComponent} from "./terapista/registrati/registrati.component";
import {ChatComponent} from "./chat/chat.component";
import {RecuperoPasswordComponent} from "./recupero/recupero-password.component";
import {DashboardComponent} from "./terapista/dashboard/dashboard.component";
import {BambinoComponent} from "./terapista/bambino/bambino/bambino.component";
import {TestoComponent} from "./terapista/testo/testo.component";
import {TestoAdattatoComponent} from "./terapista/testo_spiegato/testo-adattato.component";
import {authGuard} from "./auth.guard";



export const routes: Routes = [
  {path:'', component: HomeComponent , canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista'] }},
  {path:'login', component: LoginComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'terapista', component: HomeComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'terapista/login', component: LoginComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'terapista/registrati', component: RegistratiComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'chat', component: ChatComponent,  canActivate: [authGuard], data: { expectedRole: ['bambino'] } },
  {path:'terapista/recuperoPassword', component:  RecuperoPasswordComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'recuperoPassword', component: RecuperoPasswordComponent, canActivate: [authGuard], data: { expectedRole:[ 'bambino', '', 'terapista']}},
  {path:'terapista/dashboard', component: DashboardComponent,  canActivate: [authGuard], data: { expectedRole: ['terapista'] }},
  { path: 'terapista/dashboard/inserisciPaziente', component: BambinoComponent ,  canActivate: [authGuard],  data: { expectedRole: ['terapista'] }},
  { path: 'terapista/dashboard/visualizzaPaziente', component: BambinoComponent ,  canActivate: [authGuard], data: { expectedRole: ['terapista'] }},
  { path: 'terapista/dashboard/inserisciTesto', component: TestoComponent,  canActivate: [authGuard], data: { expectedRole: ['terapista'] } },
  { path: 'terapista/dashboard/visualizzaTesto', component: TestoComponent,  canActivate: [authGuard], data: { expectedRole: ['terapista'] } },
  { path: 'terapista/dashboard/inserisciTestoAdattato', component: TestoAdattatoComponent,   canActivate: [authGuard], data: { expectedRole: ['terapista'] }},
  { path: 'terapista/dashboard/visualizzaTestoAdattato', component: TestoAdattatoComponent,   canActivate: [authGuard], data: { expectedRole: ['terapista'] }}
];
