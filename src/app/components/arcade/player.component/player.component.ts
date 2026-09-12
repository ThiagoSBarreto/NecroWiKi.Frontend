import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
    private emulatorScript: HTMLScriptElement | null = null;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const core: string = params['core'];
            const rom: string = params['rom'];

            if (!core || !rom) {
                return;
            }

            this.initializeEmulator(core, rom);
        });
    }

    public ngOnDestroy(): void {
        if (this.emulatorScript) {
            this.emulatorScript.remove();
            this.emulatorScript = null;
        }

        this.clearEmulatorGlobals();
    }

    private initializeEmulator(core: string, rom: string): void {
        const romFilename: string = decodeURIComponent(
            rom.split('/').pop() ?? ''
        );

        const gameName: string = romFilename.replace(
            /\.[^/.]+$/,
            ''
        );

        const windowReference: any = window as any;

        windowReference.EJS_player = '#game';
        windowReference.EJS_core = core;
        windowReference.EJS_gameUrl = rom;
        windowReference.EJS_gameName = gameName;
        windowReference.EJS_pathtodata = '/assets/emulatorjs/data/';
        windowReference.EJS_startOnLoaded = true;
        windowReference.EJS_threads = false;

        this.emulatorScript = document.createElement('script');
        this.emulatorScript.src = '/assets/emulatorjs/data/loader.js';
        this.emulatorScript.async = true;

        document.body.appendChild(this.emulatorScript);
    }

    private clearEmulatorGlobals(): void {
        const windowReference: any = window as any;

        delete windowReference.EJS_player;
        delete windowReference.EJS_core;
        delete windowReference.EJS_gameUrl;
        delete windowReference.EJS_gameName;
        delete windowReference.EJS_pathtodata;
        delete windowReference.EJS_startOnLoaded;
        delete windowReference.EJS_threads;
    }
}