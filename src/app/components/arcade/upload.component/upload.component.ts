import { HttpEventType } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { GameSystemService } from '../../../services/gamesystem.service';
import { ToastService } from '../../../services/toast.service';
import { ArcadeGameModel } from '../../../models/arcade.models/arcade.game.model';

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
export class UploadComponent implements OnInit {
    @Input() systemId = 'n64';
    @Input() game: ArcadeGameModel | null = null;
    @Output() closed = new EventEmitter<boolean>();

    dialogVisible = true;
    gameName = '';
    romFiles: File[] = [];
    coverFile: File | null = null;
    coverPreview: string | null = null;
    isUploading = false;
    uploadProgress: number | null = null;
    uploadedBytes = 0;
    uploadTotalBytes: number | null = null;

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

    ngOnInit(): void {
        if (this.game) {
            this.gameName = this.game.name;
            this.coverPreview = this.game.imagePath || null;
        }
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

        this.romFiles = this.game ? [files[0]] : files;

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

        this.romFiles = this.game ? [files[0]] : files;

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
        if (this.isUploading) {
            return;
        }

        if (!this.game && !this.romFiles.length) {
            this.toastService.error('Arquivo obrigatório', 'Selecione ao menos uma ROM para fazer o upload.');
            return;
        }

        if (!this.gameName.trim()) {
            this.toastService.error('Nome obrigatório', 'Informe o nome do jogo antes de confirmar.');
            return;
        }

        const formData = new FormData();
        formData.append('name', this.gameName.trim());

        if (this.game) {
            if (this.romFiles[0]) {
                formData.append('romFile', this.romFiles[0], this.romFiles[0].name);
            }
        } else {
            formData.append('system', this.systemId);
            this.romFiles.forEach(file => {
                formData.append('romFiles', file, file.name);
            });
        }

        if (this.coverFile) {
            formData.append('coverFile', this.coverFile, this.coverFile.name);
        }

        this.isUploading = true;
        this.uploadProgress = null;
        this.uploadedBytes = 0;
        this.uploadTotalBytes = null;

        const request = this.game
            ? this.gameSystemService.updateGame(this.systemId, this.game.name, formData)
            : this.gameSystemService.uploadGame(this.systemId, formData);

        request.subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.uploadedBytes = event.loaded;
                    this.uploadTotalBytes = event.total ?? null;
                    this.uploadProgress = this.uploadTotalBytes === null
                        ? null
                        : Math.round((event.loaded / this.uploadTotalBytes) * 100);
                    this.cdr.markForCheck();
                    return;
                }

                if (event.type !== HttpEventType.Response) {
                    return;
                }

                this.isUploading = false;
                const response = event.body;
                if (response?.message === 'success') {
                    this.toastService.success(
                        'Sucesso',
                        this.game ? 'Jogo atualizado com sucesso!' : 'Jogo adicionado com sucesso!'
                    );
                    this.closePopup(true);
                    return;
                }

                this.toastService.error('Erro', response?.message ?? 'Não foi possível adicionar o jogo.');
            },
            error: (err) => {
                this.isUploading = false;
                this.cdr.markForCheck();
                const message = err?.error?.message ?? err?.message ?? 'Não foi possível adicionar o jogo.';
                this.toastService.error('Erro', message);
            }
        });
    }

    formatBytes(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        const formattedSize = size.toFixed(unitIndex === 0 || size >= 10 ? 0 : 1);
        return `${formattedSize} ${units[unitIndex]}`;
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
        this.isUploading = false;
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
