import { Component, inject } from '@angular/core';
import {
    RouterLink,
    RouterLinkActive
} from '@angular/router';

import { WIKI_CONFIG } from '../../config/wiki.config';
import { DownloadService } from '../../services/download.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class SidebarComponent {

    readonly wikiItems = WIKI_CONFIG;
    readonly downloadService = inject(DownloadService);

}