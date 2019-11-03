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
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.run();
        });
    }
    async run() {
        this.setupPush();
        this.session.status = await this.session.getStorage('project-status') || false;
        this.session.user = await this.session.getStorage('project-user') || {};
        if (this.session.status == false) {
            this.router.navigateByUrl('/login', { replaceUrl: true });
        }
    }
    setupPush() {
        if (this.platform.is('cordova')) {
            this.oneSignal.startInit('28beb7a0-96b8-416d-8ed9-01e25e43a715', '169711519927');
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            this.oneSignal.handleNotificationReceived().subscribe((jsonData) => {
                let msg = "handleNotificationReceived<br>" + JSON.stringify(jsonData);
                this.session.showAlert(msg);
            });
            this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
                let msg = "handleNotificationOpened<br>" + JSON.stringify(jsonData);
                this.session.showAlert(msg);
            });
            this.oneSignal.endInit();
        } else {
            this.session.showAlert('ไม่รองรับ push บนบราวเซอร์');
        }
    }
}
