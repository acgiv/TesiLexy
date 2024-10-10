import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import {RecuperoService} from "./recupero/recupero.service";
import {ControlFormDirective} from "./form/control-form.directive";
import {BambinoService} from "./terapista/bambino/bambino/bambino.service";
import {TestoService} from "./terapista/testo/testo.service";
import {DashboardDirective} from "./terapista/dashboard/dashboard.directive";
import {ChatDirectiveDirective} from "./chat/chat_directive/chat-directive.directive";
import {ChatServiceService} from "./chat/chat-service.service";


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    RecuperoService,
    ControlFormDirective,
    BambinoService ,
    TestoService,
    ChatDirectiveDirective,
    ChatServiceService
  ]
};
