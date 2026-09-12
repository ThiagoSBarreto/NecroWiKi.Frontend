import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { GameSystemService } from '../../../services/gamesystem.service';
import { ArcadeGameModel } from '../../../models/arcade.models/arcade.game.model';

interface ArcadeSystemMeta {
    id: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-gamesystem-library',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        CardModule,
        TagModule,
        TooltipModule,
        InputGroupModule,
        InputGroupAddonModule
    ],
    templateUrl: './gamesystem.component.html',
    styleUrl: './gamesystem.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesystemComponent implements OnInit {

    games: ArcadeGameModel[] = [];
    filteredGames: ArcadeGameModel[] = [];

    searchTerm: string = '';
    selectedSort: string = 'name-asc';

    systemId: string = 'n64';
    systemMeta: ArcadeSystemMeta = {
        id: 'n64',
        label: 'Nintendo 64',
        icon: '/images/nintendo64.png'
    };

    sortOptions = [
        {
            label: 'Nome A-Z',
            value: 'name-asc'
        },
        {
            label: 'Nome Z-A',
            value: 'name-desc'
        }
    ];

    private readonly systemMap: Record<string, ArcadeSystemMeta> = {
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
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly cdr: ChangeDetectorRef,
        private readonly gameSystemService: GameSystemService
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const systemKey = (params.get('system') ?? 'n64').toLowerCase();

            this.systemId = systemKey;
            this.systemMeta = this.systemMap[systemKey] ?? this.systemMap[systemKey] ?? this.systemMap['n64'];

            this.loadGamesFromBackend(systemKey);
        });
    }

    private loadGamesFromBackend(systemId: string): void {
        this.gameSystemService.getGameList(systemId).subscribe({
            next: (games) => {
                this.games = games;
                this.applyFilters();
                this.cdr.markForCheck();
            },
            error: () => {
                this.filteredGames = [];
                this.games = [];
                this.cdr.markForCheck();
            }
        });
    }

    applyFilters(): void {
        const search = this.searchTerm.trim().toLowerCase();

        this.filteredGames = this.games.filter(game => {
            const matchesSearch =
                !search ||
                game.name.toLowerCase().includes(search);

            return matchesSearch;
        });

        this.applySort();
        this.cdr.markForCheck();
    }

    private applySort(): void {
        this.filteredGames = [...this.filteredGames].sort((first, second) => {
            switch (this.selectedSort) {
                case 'name-desc':
                    return second.name.localeCompare(first.name);

                case 'name-asc':
                default:
                    return first.name.localeCompare(second.name);
            }
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedSort = 'name-asc';

        this.applyFilters();
    }

    goHome(): void {
        this.router.navigate(['/']);
    }

    openUpload(): void {
        this.router.navigate([`/arcade/${this.systemId}/upload`]);
    }

    openGame(game: ArcadeGameModel): void {
        this.router.navigate(['/arcade', this.systemId, 'game', game.name]);
    }

    getCoverImage(game: ArcadeGameModel): string {
        return game.imagePath;
    }
}
