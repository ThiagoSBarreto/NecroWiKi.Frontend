import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WIKI_CONFIG } from '../config/wiki.config';
import { DownloadService } from '../services/download.service';

@Component({
    selector: 'app-home-portal',
    imports: [NgOptimizedImage, RouterLink],
    templateUrl: './home-portal.html',
    styleUrl: './home-portal.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePortalComponent {
    readonly wikiItems = WIKI_CONFIG;
    readonly downloadService = inject(DownloadService);
}