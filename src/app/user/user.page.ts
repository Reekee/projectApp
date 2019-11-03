import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
    constructor(
        private router: Router,
        private session: SessionService
    ) { }
    ngOnInit() {
    }
    logout() {
        this.session.showConfirm('คุณแน่ใจต้องการออกจากระบบใช่หรือไม่ ?').then(rs => {
            if (rs) {
                this.session.status = false;
                this.session.user = {};
                this.session.removeStorage('project-status');
                this.session.removeStorage('project-user');
                this.router.navigateByUrl('/login', { replaceUrl: true });
            }
        });
    }
}
