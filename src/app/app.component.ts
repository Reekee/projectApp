import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SessionService } from './session/session.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private session: SessionService,
        private oneSignal: OneSignal
    ) {
        this.initializeApp();
    }
    initializeApp() {
        this.platform.ready().then(async () => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.router.navigateByUrl('/', { replaceUrl: true });
            let api = await this.session.getStorage("api");
            if (api) this.session.api = api;
            this.session.ajax(this.session.api + 'check-project-api.php', {}, false).then(async (res: any) => {
                if (res.status) {
                    await this.session.setStorage("api", this.session.api);
                    this.run();
                } else {
                    this.router.navigateByUrl('/set-api', { replaceUrl: true });
                }
            }).catch(error => {
                this.router.navigateByUrl('/set-api', { replaceUrl: true });
            });
        });
    }
    async run() {
        this.session.status = await this.session.getStorage('project-status') || false;
        this.session.user = await this.session.getStorage('project-user') || {};
        if (this.session.status == false) {
            this.router.navigateByUrl('/login', { replaceUrl: true });
        } else {
            this.session.setupPush();
            this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
        }
    }

}
