import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegistratiComponent} from "./terapista/registrati/registrati.component";
import {ChatComponent} from "./chat/chat.component";

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'terapista', component: HomeComponent},
  {path:'terapista/login', component: LoginComponent},
  {path:'terapista/registrati', component: RegistratiComponent},
  {path:'terapista/chat', component: ChatComponent},
  {path:'chat', component: ChatComponent}
];
