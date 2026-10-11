import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, SecurityContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Marked } from 'marked';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TutorialDocument, TutorialListItem } from '../models/tutorial.models';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { TutorialService } from '../services/tutorial.service';

interface TutorialCategory {
    value: string;
    label: string;
    color: string;
}

@Component({
    selector: 'app-tutorials',
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule],
    templateUrl: './tutorials.html',
    styleUrl: './tutorials.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorialsComponent implements OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly tutorialService = inject(TutorialService);
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly destroyRef = inject(DestroyRef);

    readonly tutorials = signal<TutorialListItem[]>([]);
    readonly tutorial = signal<TutorialDocument | null>(null);
    readonly renderedMarkdown = signal('');
    readonly loading = signal(true);
    readonly errorMessage = signal('');
    readonly currentCategory = signal<string | null>(null);
    readonly isArticle = signal(false);
    readonly isPublishing = signal(false);
    readonly editingTutorial = signal<TutorialDocument | null>(null);

    readonly categories: TutorialCategory[] = [
        { value: 'wow', label: 'World of Warcraft', color: 'gold' },
        { value: 'ragnarok', label: 'Ragnarok', color: 'cyan' },
        { value: 'warcraft3', label: 'Warcraft III', color: 'red' },
        { value: 'diablo2', label: 'Diablo II', color: 'crimson' },
        { value: 'arcade', label: 'Arcade', color: 'green' }
    ];

    showCreateDialog = false;
    title = '';
    category = 'wow';
    summary = '';
    videoUrl = '';
    markdownFile: File | null = null;
    imageFiles: File[] = [];
    searchTerm = '';
    private markdownImageUrls: string[] = [];

    constructor() {
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            this.clearMarkdownImageUrls();
            const category = params.get('category');
            const slug = params.get('slug');
            this.currentCategory.set(category);
            this.isArticle.set(slug !== null);
            this.errorMessage.set('');
            this.loading.set(true);

            if (slug) {
                this.loadTutorial(slug);
            } else {
                this.tutorial.set(null);
                this.renderedMarkdown.set('');
                this.loadTutorials(category);
            }
        });
    }

    ngOnDestroy(): void {
        this.clearMarkdownImageUrls();
    }

    selectCategory(category: string | null): void {
        void this.router.navigate(category ? ['/tutorials', category] : ['/tutorials']);
    }

    openTutorial(tutorial: TutorialListItem): void {
        void this.router.navigate(['/tutorials', tutorial.category, tutorial.slug]);
    }

    canManage(tutorial: TutorialListItem): boolean {
        return this.authService.isAdmin() || this.authService.account()?.id === tutorial.ownerId;
    }

    openCreateDialog(): void {
        this.resetForm();
        this.showCreateDialog = true;
    }

    openEditDialog(tutorial: TutorialDocument): void {
        this.editingTutorial.set(tutorial);
        this.title = tutorial.title;
        this.category = tutorial.category;
        this.summary = tutorial.summary;
        this.videoUrl = tutorial.videoUrl ?? '';
        this.markdownFile = null;
        this.imageFiles = [];
        this.showCreateDialog = true;
    }

    onSearchChange(search: string): void {
        this.searchTerm = search;
        this.loadTutorials(this.currentCategory());
    }

    deleteTutorial(tutorial: TutorialDocument): void {
        if (!confirm(`Excluir o tutorial "${tutorial.title}"?`)) {
            return;
        }

        this.tutorialService.deleteTutorial(tutorial.slug).subscribe({
            next: () => {
                this.toastService.success('Excluído', 'Tutorial removido.');
                this.selectCategory(tutorial.category);
            },
            error: error => this.toastService.error('Não foi possível excluir', this.apiErrorMessage(error))
        });
    }

    backToList(): void {
        const category = this.tutorial()?.category ?? this.currentCategory();
        this.selectCategory(category);
    }

    categoryLabel(value: string): string {
        return this.categories.find(category => category.value === value)?.label ?? value;
    }

    categoryColor(value: string): string {
        return this.categories.find(category => category.value === value)?.color ?? 'green';
    }

    onMarkdownSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.markdownFile = input.files?.[0] ?? null;
    }

    onImagesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.imageFiles = Array.from(input.files ?? []);
    }

    publish(): void {
        if (this.isPublishing()) {
            return;
        }

        const editingTutorial = this.editingTutorial();
        if (!this.title.trim() || !this.summary.trim() || (!editingTutorial && !this.markdownFile)) {
            this.toastService.error('Campos obrigatórios', 'Preencha título, resumo e selecione o arquivo Markdown.');
            return;
        }

        const payload = new FormData();
        payload.append('title', this.title.trim());
        payload.append('category', this.category);
        payload.append('summary', this.summary.trim());
        payload.append('videoUrl', this.videoUrl.trim());
        if (this.markdownFile) {
            payload.append('markdownFile', this.markdownFile, this.markdownFile.name);
        }
        this.imageFiles.forEach(image => payload.append('images', image, image.name));

        this.isPublishing.set(true);
        const request = editingTutorial
            ? this.tutorialService.updateTutorial(editingTutorial.slug, payload)
            : this.tutorialService.publishTutorial(payload);
        request.subscribe({
            next: tutorial => {
                this.isPublishing.set(false);
                this.showCreateDialog = false;
                this.resetForm();
                this.toastService.success(
                    editingTutorial ? 'Atualizado' : 'Publicado',
                    editingTutorial ? 'Tutorial atualizado com sucesso.' : 'Tutorial publicado com sucesso.'
                );
                void this.router.navigate(['/tutorials', tutorial.category, tutorial.slug]);
            },
            error: (error: HttpErrorResponse) => {
                this.isPublishing.set(false);
                this.toastService.error('Não foi possível publicar', this.apiErrorMessage(error));
            }
        });
    }

    closeCreateDialog(): void {
        this.showCreateDialog = false;
        this.resetForm();
    }

    private loadTutorials(category: string | null): void {
        this.tutorialService.getTutorials(category, this.searchTerm).subscribe({
            next: tutorials => {
                this.tutorials.set(tutorials);
                this.loading.set(false);
            },
            error: error => {
                this.loading.set(false);
                this.errorMessage.set(this.apiErrorMessage(error));
            }
        });
    }

    private loadTutorial(slug: string): void {
        this.tutorialService.getTutorial(slug).subscribe({
            next: tutorial => {
                this.tutorial.set(tutorial);
                this.currentCategory.set(tutorial.category);
                this.loading.set(false);
                void this.renderMarkdown(tutorial);
            },
            error: error => {
                this.loading.set(false);
                this.errorMessage.set(this.apiErrorMessage(error));
            }
        });
    }

    private async renderMarkdown(tutorial: TutorialDocument): Promise<void> {
        const parser = new Marked({
            async: true,
            breaks: false,
            gfm: true,
            pedantic: false
        });
        parser.use({
            walkTokens: async token => {
                if (token.type !== 'image' || !('href' in token)) {
                    return;
                }

                const relativeImage = token.href.replace(/^\.\//, '');
                if (!relativeImage.startsWith('images/')) {
                    return;
                }

                const fileName = decodeURIComponent(relativeImage.slice('images/'.length));
                if (fileName.includes('/') || !fileName) {
                    return;
                }

                try {
                    const image = await firstValueFrom(this.tutorialService.getImage(tutorial.slug, fileName));
                    const objectUrl = URL.createObjectURL(image);
                    this.markdownImageUrls.push(objectUrl);
                    token.href = objectUrl;
                } catch {
                    token.href = '';
                }
            }
        });
        const html = await parser.parse(tutorial.markdown);
        this.renderedMarkdown.set(this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '');
    }

    private clearMarkdownImageUrls(): void {
        this.markdownImageUrls.forEach(url => URL.revokeObjectURL(url));
        this.markdownImageUrls = [];
    }

    resetForm(): void {
        this.editingTutorial.set(null);
        this.title = '';
        this.category = this.currentCategory() ?? 'wow';
        this.summary = '';
        this.videoUrl = '';
        this.markdownFile = null;
        this.imageFiles = [];
    }

    private apiErrorMessage(error: HttpErrorResponse): string {
        return error.error?.message ?? 'Verifique a conexão e tente novamente.';
    }
}