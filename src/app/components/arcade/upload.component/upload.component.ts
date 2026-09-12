import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { GameSystemService } from '../../../services/gamesystem.service';
import { ToastService } from '../../../services/toast.service';

interface UploadSystemMeta {
    id: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-upload-popup',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule
    ],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
    @Input() systemId = 'n64';
    @Output() closed = new EventEmitter<boolean>();

    dialogVisible = true;
    gameName = '';
    romFiles: File[] = [];
    coverFile: File | null = null;
    coverPreview: string | null = null;

    private readonly systemMap: Record<string, UploadSystemMeta> = {
        n64: {
            id: 'n64',
            label: 'Nintendo 64',
            icon: '/images/nintendo64.png'
        },
        snes: {
            id: 'snes',
            label: 'SNES',
            icon: '/images/sness.png'
        },
        gba: {
            id: 'gba',
            label: 'Game Boy Advance',
            icon: '/images/gba.png'
        },
        psx: {
            id: 'psx',
            label: 'PlayStation',
            icon: '/images/ps1.png'
        }
    };

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameSystemService: GameSystemService,
        private readonly toastService: ToastService
    ) {
    }

    get platformMeta(): UploadSystemMeta {
        return this.systemMap[this.systemId] ?? this.systemMap['n64'];
    }

    onRomFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);

        if (!files.length) {
            return;
        }

        this.romFiles = files;

        if (!this.gameName.trim()) {
            const firstRomName = this.getBaseFileName(files[0].name);
            this.gameName = this.makeDisplayNameFromRom(firstRomName);
        }

        this.cdr.markForCheck();
    }

    onRomFilesDropped(event: DragEvent): void {
        event.preventDefault();
        const files = Array.from(event.dataTransfer?.files ?? []);

        if (!files.length) {
            return;
        }

        this.romFiles = files;

        if (!this.gameName.trim()) {
            const firstRomName = this.getBaseFileName(files[0].name);
            this.gameName = this.makeDisplayNameFromRom(firstRomName);
        }

        this.cdr.markForCheck();
    }

    onRomDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onCoverSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (!file) {
            return;
        }

        this.readCoverFile(file);
    }

    onCoverDropped(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0] ?? null;

        if (!file) {
            return;
        }

        this.readCoverFile(file);
    }

    onCoverDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    handleDialogHide(): void {
        this.closePopup(false);
    }

    cancel(): void {
        this.closePopup(false);
    }

    confirm(): void {
        if (!this.romFiles.length) {
            this.toastService.error('Arquivo obrigatório', 'Selecione ao menos uma ROM para fazer o upload.');
            return;
        }

        if (!this.gameName.trim()) {
            this.toastService.error('Nome obrigatório', 'Informe o nome do jogo antes de confirmar.');
            return;
        }

        const formData = new FormData();
        formData.append('system', this.systemId);
        formData.append('name', this.gameName.trim());

        this.romFiles.forEach(file => {
            formData.append('romFiles', file, file.name);
        });

        if (this.coverFile) {
            formData.append('coverFile', this.coverFile, this.coverFile.name);
        }

        this.gameSystemService.uploadGame(this.systemId, formData).subscribe({
            next: (response) => {
                if (response?.message === 'success') {
                    this.toastService.success('Sucesso', 'Jogo adicionado com sucesso! Recarregue a página para exibi-lo!');
                    this.closePopup(true);
                    return;
                }

                this.toastService.error('Erro', response?.message ?? 'Não foi possível adicionar o jogo.');
            },
            error: (err) => {
                const message = err?.error?.message ?? err?.message ?? 'Não foi possível adicionar o jogo.';
                this.toastService.error('Erro', message);
            }
        });
    }

    private readCoverFile(file: File): void {
        this.coverFile = file;

        const reader = new FileReader();
        reader.onload = () => {
            this.coverPreview = typeof reader.result === 'string' ? reader.result : null;
            this.cdr.markForCheck();
        };
        reader.readAsDataURL(file);
    }

    private closePopup(success = false): void {
        this.dialogVisible = false;
        this.romFiles = [];
        this.coverFile = null;
        this.coverPreview = null;
        this.gameName = '';
        this.closed.emit(success);
    }

    private getBaseFileName(fileName: string): string {
        return fileName.split(/[\\/]/).pop() ?? fileName;
    }

    private makeDisplayNameFromRom(fileName: string): string {
        const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
        return withoutExtension
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
