import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AccessService} from "./access.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccessService);
  const router = inject(Router);
  const expectedRoles = route.data['expectedRole'] as string[];
  const userRole = authService.getRuolo();
  const navigation = router.getCurrentNavigation();
  const navigatedByButton = navigation?.extras.state;


     // Se l'utente è autenticato ma tenta di accedere a pagine come login o registrazione, reindirizza alla home appropriata
    if (userRole != '' &&
      (state.url === '/login' ||
       state.url === '/terapista/registrati' ||
       state.url === '/terapista/login'  ||
       state.url === "/recuperoPassword"  ||
       state.url === "/terapista/recuperoPassword")) {
    router.navigate([userRole == "terapista" ? "/terapista" : "/"],{state: {navigatedByButton: true}}).then(() => {});
    return false;
  }

  if (expectedRoles.includes(userRole)) {
       return navigator_control();
  } else {
      router.navigate(["/"], {
      state: {navigatedByButton: true}}).then(() => {});
      return false;
  }

  function is_terapista_url() {
    const url = state.url.split("/")[1];
    return url === "terapista";
  }

  function navigator_control(){
    if (navigatedByButton ) {
        if ( navigatedByButton['navigatedByButton']) {
          return true;
        }else{
          router.navigate([userRole === "terapista" && is_terapista_url()? "/terapista" : "/"], {state: {navigatedByButton: true}}).then(() => {});
          return false;
        }
      }else{
         router.navigate([userRole === "terapista" && is_terapista_url()? "/terapista" : "/"], {state: {navigatedByButton: true}}).then(() => {});
          return false;
      }
  }

};


