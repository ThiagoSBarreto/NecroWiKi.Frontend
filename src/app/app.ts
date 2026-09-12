import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';

import { LoadingService } from './services/loading.service';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ToastModule
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit {

    loading = false;

    constructor(
        private readonly loadingService: LoadingService
    ) {
    }

    ngOnInit(): void {
        this.loadingService.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }
}