import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import {RecuperoService} from "./recupero/recupero.service";
import {ControlFormDirective} from "./form/control-form.directive";
import {BambinoService} from "./terapista/bambino/bambino/bambino.service";
import {TestoService} from "./terapista/testo/testo.service";


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), RecuperoService,  ControlFormDirective, BambinoService , TestoService]
};
