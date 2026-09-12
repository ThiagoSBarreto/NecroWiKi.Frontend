import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
    private emulatorScript: HTMLScriptElement | null = null;
    private systemId = 'n64';
    private readonly cleanupEmulator = () => this.destroyEmulator();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        window.addEventListener('beforeunload', this.cleanupEmulator);
    }

    public ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.systemId = (params.get('system') ?? 'n64').toLowerCase();
        });

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
        this.destroyEmulator();
        window.removeEventListener('beforeunload', this.cleanupEmulator);
    }

    public goBack(): void {
        this.router.navigate(['/arcade', this.systemId]);
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
        windowReference.EJS_pathtodata = '/emulatorjs/data/';
        windowReference.EJS_startOnLoaded = true;
        windowReference.EJS_threads = false;
        windowReference.EJS_disableDatabases = true;
        windowReference.EJS_disableLocalStorage = true;

        this.emulatorScript = document.createElement('script');
        this.emulatorScript.src = '/emulatorjs/data/loader.js';
        this.emulatorScript.async = true;

        document.body.appendChild(this.emulatorScript);
    }

    private destroyEmulator(): void {
        const windowReference: any = window as any;

        try {
            if (windowReference.EJS_emulator?.gameManager?.toggleMainLoop) {
                windowReference.EJS_emulator.gameManager.toggleMainLoop(0);
            }

            if (typeof windowReference.EJS_emulator?.pause === 'function') {
                windowReference.EJS_emulator.pause(true);
            }

            if (windowReference.EJS_emulator?.Module?.AL?.currentCtx?.audioCtx) {
                const audioContext = windowReference.EJS_emulator.Module.AL.currentCtx.audioCtx;
                if (audioContext.state !== 'closed') {
                    try {
                        audioContext.suspend();
                        audioContext.close();
                    } catch {
                        // Contexto já finalizado pelo navegador.
                    }
                }
            }

            if (windowReference.EJS_emulator?.Module?.abort) {
                try {
                    windowReference.EJS_emulator.Module.abort();
                } catch {
                    // Runtime já terminou.
                }
            }
        } catch {
            // Ignora falhas de limpeza em rota rápida.
        }

        const gameRoot = document.getElementById('game');
        if (gameRoot) {
            gameRoot.innerHTML = '';
        }

        if (this.emulatorScript) {
            this.emulatorScript.remove();
            this.emulatorScript = null;
        }

        this.clearEmulatorGlobals();
        this.clearEmulatorDatabases();
    }

    private clearEmulatorDatabases(): void {
        if (!('indexedDB' in window)) {
            return;
        }

        ['EmulatorJS-core', 'EmulatorJS-roms', 'EmulatorJS-bios', 'EmulatorJS-states']
            .forEach(dbName => {
                try {
                    indexedDB.deleteDatabase(dbName);
                } catch {
                    // Ignora falhas de exclusão do banco em navegações rápidas.
                }
            });
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
        delete windowReference.EJS_disableDatabases;
        delete windowReference.EJS_disableLocalStorage;
        delete windowReference.EJS_emulator;
    }
}