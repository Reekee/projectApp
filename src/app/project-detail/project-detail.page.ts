import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.page.html',
    styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {
    project_id = '';
    project: any = {};
    constructor(
        private nav: NavController,
        private route: ActivatedRoute,
        private session: SessionService
    ) { }
    ngOnInit() {
        this.project_id = this.route.snapshot.paramMap.get('project_id');
        this.loadData();
    }
    loadData() {
        this.session.ajax(this.session.api + "project-get-once.php", {
            project_id: this.project_id
        }, true).then((res: any) => {
            if (res.status == true) {
                this.project = res.project;
            } else {
                this.session.showAlert(res.message).then(rs => {
                    this.nav.pop();
                });
            }
        }).catch(error => {
            this.session.showAlert(error);
        });
    }
}
