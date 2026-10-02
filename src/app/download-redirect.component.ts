import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WIKI_CONFIG } from './config/wiki.config';
import { DownloadService } from './services/download.service';

@Component({
    selector: 'app-download-redirect',
    template: ''
})
export class DownloadRedirectComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly downloadService = inject(DownloadService);

    ngOnInit(): void {
        const downloadId = this.route.snapshot.paramMap.get('downloadId');
        const link = WIKI_CONFIG.flatMap(item => item.links).find(item =>
            item.route === `/download/${downloadId}` && item.downloadGameName
        );

        if (!link?.downloadGameName) {
            void this.router.navigateByUrl('/home', { replaceUrl: true });
            return;
        }

        window.location.replace(this.downloadService.downloadUrl(link.downloadGameName));
    }
}