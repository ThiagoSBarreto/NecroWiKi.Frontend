import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { WIKI_CONFIG } from '../config/wiki.config';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        ButtonModule
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class HomeComponent {

    readonly wikiItems = WIKI_CONFIG;

    openExternal(url: string): void {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

}