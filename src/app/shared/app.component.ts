import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import config from 'devextreme/core/config';
import { enableProdMode } from '@angular/core';
import { EventsService } from 'angular-event-service/dist';
import * as fa from 'devextreme/localization/messages/fa.json';
import { locale, loadMessages } from 'devextreme/localization';

// import 'devextreme/localization/globalize/number';
// import 'devextreme/localization/globalize/date';
// import 'devextreme/localization/globalize/currency';
// import 'devextreme/localization/globalize/message';

// Dictionaries for German and Russian languages
// import faMessages from 'devextreme/localization/messages/en.json';

//import faCaGregorian from 'npm:cldr-dates-full/main/de/ca-gregorian.!json';
// import faNumbers from 'cldr-data/main/fa/numbers.json!json';
// import faCurrencies from 'cldr-data/main/fa/currencies.json!json';

// import likelySubtags from 'cldr-data/supplemental/likelySubtags.json!json';
// import timeData from 'cldr-data/supplemental/timeData.json!json';
// import weekData from 'cldr-data/supplemental/weekData.json!json';
// import currencyData from 'cldr-data/supplemental/currencyData.json!json';
// import numberingSystems from 'cldr-data/supplemental/numberingSystems.json!json';

import { ThemeService } from './services/ThemeService';



declare function page_resize(): any;


if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(
        private router: Router,
        private eventsService: EventsService,
        private themeService: ThemeService

    ) {
        config({
            rtlEnabled: true,
            thousandsSeparator: ',',
            forceIsoDateParsing: true
        });
        router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
                eventsService.broadcast('loading', true);
            }
            if (event instanceof NavigationEnd) {
                eventsService.broadcast('loading', false);
                page_resize();
            }
        });


        if (!localStorage.getItem('dx-theme')) {
            themeService.lightTheme();
        } else {
            themeService.SetUserTheme(localStorage.getItem('dx-theme'));
        }

        
        loadMessages(fa);
        locale('fa');

    }

}
