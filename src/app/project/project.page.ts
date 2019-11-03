import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session/session.service';
import { Router, NavigationEnd } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { async } from 'q';

@Component({
    selector: 'app-project',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
    projects = [];
    search = '';
    private subscription: Subscription;
    constructor(
        private actionSheetController: ActionSheetController,
        private router: Router,
        private session: SessionService
    ) { }
    ngOnInit() {
        this.subscription = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd && event.url === '/tabs/project') {
                setTimeout(() => {
                    this.loadData(this.projects.length == 0);
                }, 100);
            }
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    loadData(isLoading = true) {
        this.session.ajax(this.session.api + "project-get.php", {
            search: this.search
        }, isLoading).then((res: any) => {
            if (res.status == true) {
                this.projects = res.projects;
            } else {
                this.session.showAlert(res.message);
            }
        }).catch(error => {
            this.session.showAlert(error);
        });
    }
    add() {
        this.router.navigateByUrl('/project-add');
    }
    async open(project) {
        const actionSheet = await this.actionSheetController.create({
            header: 'เลือกรายการ',
            buttons: [
                {
                    text: 'เปิดดูโครงการ',
                    icon: 'open',
                    handler: () => {
                        this.router.navigateByUrl('/project-detail/' + project.project_id);
                    }
                },
                {
                    text: 'แก้ไขโครงการ',
                    icon: 'create',
                    handler: () => {
                        this.router.navigateByUrl('/project-edit/' + project.project_id);
                    }
                },
                {
                    text: 'ลบโครงการ',
                    icon: 'trash',
                    handler: () => {

                    }
                },
            ]
        });
        await actionSheet.present();
    }
}
