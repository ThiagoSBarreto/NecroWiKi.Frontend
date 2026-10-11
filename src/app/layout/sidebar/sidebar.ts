import { Component, inject } from '@angular/core';
import {
    RouterLink,
    RouterLinkActive
} from '@angular/router';

import { WIKI_CONFIG } from '../../config/wiki.config';
import { DownloadService } from '../../services/download.service';
import { AuthService } from '../../services/auth.service';
import { SidebarStateService } from '../../services/sidebar-state.service';

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
    readonly authService = inject(AuthService);
    readonly sidebarState = inject(SidebarStateService);

    get visibleWikiItems() {
        if (!this.authService.isGuest()) {
            return this.wikiItems;
        }

        const arcade = this.wikiItems.find(item => item.id === 'arcade');
        return arcade
            ? [{ ...arcade, links: arcade.links.filter(link => link.route.startsWith('/arcade/') && link.route !== '/arcade/tutorials') }]
            : [];
    }

}