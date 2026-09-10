import { Component } from '@angular/core';
import {
    RouterLink,
    RouterLinkActive
} from '@angular/router';

import { WIKI_CONFIG } from '../../config/wiki.config';

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

}