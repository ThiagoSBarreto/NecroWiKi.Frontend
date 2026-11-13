import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { WIKI_CONFIG } from '../config/wiki.config';
import { DownloadService } from '../services/download.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        ButtonModule
    ],
    providers: [
        DownloadService
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class HomeComponent {

    readonly wikiItems = WIKI_CONFIG;

    constructor(
        private readonly downloadService: DownloadService
    ) {
    }

    openExternal(url: string): void {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    downloadGame(gameName: string): void {
        this.downloadService.downloadGame(gameName);
    }

}