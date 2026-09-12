import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ArcadeGame } from '../../../models/arcade.models/arcade.game.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-n64-library',
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
    templateUrl: './n64.component.html',
    styleUrl: './n64.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class N64LibraryComponent implements OnInit {

    games: ArcadeGame[] = [];
    filteredGames: ArcadeGame[] = [];

    searchTerm: string = '';
    selectedGenre: string = '';
    selectedYear: number | null = null;
    selectedSort: string = 'name-asc';

    genres: string[] = [];
    years: number[] = [];

    loading: boolean = false;

    sortOptions = [
        {
            label: 'Nome A-Z',
            value: 'name-asc'
        },
        {
            label: 'Nome Z-A',
            value: 'name-desc'
        },
        {
            label: 'Ano mais recente',
            value: 'year-desc'
        },
        {
            label: 'Ano mais antigo',
            value: 'year-asc'
        }
    ];

    constructor(
        private readonly router: Router,
        private readonly cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.loadMockGames();
        this.loadFilters();
        this.applyFilters();
    }

    private loadMockGames(): void {
        this.games = [
            {
                id: 1,
                systemId: 'n64',
                name: 'Super Mario 64',
                description: 'A clássica aventura tridimensional de Mario.',
                genre: 'Plataforma',
                releaseYear: 1996,
                developer: 'Nintendo EAD',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/super-mario-64.jpg',
                romFileName: 'Super Mario 64.z64'
            },
            {
                id: 2,
                systemId: 'n64',
                name: 'The Legend of Zelda: Ocarina of Time',
                description: 'Uma das maiores aventuras da história dos videogames.',
                genre: 'Aventura',
                releaseYear: 1998,
                developer: 'Nintendo EAD',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/ocarina-of-time.jpg',
                romFileName: 'Legend of Zelda Ocarina of Time.z64'
            },
            {
                id: 3,
                systemId: 'n64',
                name: 'GoldenEye 007',
                description: 'FPS baseado no filme de James Bond.',
                genre: 'Shooter',
                releaseYear: 1997,
                developer: 'Rare',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: '12 anos',
                coverImage: 'assets/images/arcade/n64/goldeneye-007.jpg',
                romFileName: 'GoldenEye 007.z64'
            },
            {
                id: 4,
                systemId: 'n64',
                name: 'Mario Kart 64',
                description: 'Corridas clássicas com personagens da Nintendo.',
                genre: 'Corrida',
                releaseYear: 1996,
                developer: 'Nintendo EAD',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/mario-kart-64.jpg',
                romFileName: 'Mario Kart 64.z64'
            },
            {
                id: 5,
                systemId: 'n64',
                name: 'Banjo-Kazooie',
                description: 'Uma aventura de plataforma desenvolvida pela Rare.',
                genre: 'Plataforma',
                releaseYear: 1998,
                developer: 'Rare',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/banjo-kazooie.jpg',
                romFileName: 'Banjo Kazooie.z64'
            },
            {
                id: 6,
                systemId: 'n64',
                name: 'Perfect Dark',
                description: 'Espionagem, ação e tiroteios em uma campanha futurista.',
                genre: 'Shooter',
                releaseYear: 2000,
                developer: 'Rare',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: '16 anos',
                coverImage: 'assets/images/arcade/n64/perfect-dark.jpg',
                romFileName: 'Perfect Dark.z64'
            },
            {
                id: 7,
                systemId: 'n64',
                name: 'Super Smash Bros.',
                description: 'Batalhas entre os maiores personagens da Nintendo.',
                genre: 'Luta',
                releaseYear: 1999,
                developer: 'HAL Laboratory',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/super-smash-bros.jpg',
                romFileName: 'Super Smash Bros.z64'
            },
            {
                id: 8,
                systemId: 'n64',
                name: 'The Legend of Zelda: Majora’s Mask',
                description: 'Uma aventura sombria ambientada em Termina.',
                genre: 'Aventura',
                releaseYear: 2000,
                developer: 'Nintendo EAD',
                publisher: 'Nintendo',
                region: 'USA',
                language: 'Inglês',
                ageRating: 'Livre',
                coverImage: 'assets/images/arcade/n64/majoras-mask.jpg',
                romFileName: 'Legend of Zelda Majoras Mask.z64'
            }
        ];

        this.cdr.markForCheck();
    }

    private loadFilters(): void {
        this.genres = [
            ...new Set(
                this.games
                    .map(game => game.genre)
                    .filter((genre): genre is string => !!genre)
            )
        ].sort();

        this.years = [
            ...new Set(
                this.games
                    .map(game => game.releaseYear)
                    .filter((year): year is number => !!year)
            )
        ].sort((a, b) => b - a);
    }

    applyFilters(): void {
        const search = this.searchTerm.trim().toLowerCase();

        this.filteredGames = this.games.filter(game => {
            const matchesSearch =
                !search ||
                game.name.toLowerCase().includes(search) ||
                game.description?.toLowerCase().includes(search) ||
                game.genre?.toLowerCase().includes(search) ||
                game.developer?.toLowerCase().includes(search) ||
                game.publisher?.toLowerCase().includes(search) ||
                game.releaseYear?.toString().includes(search);

            const matchesGenre =
                !this.selectedGenre ||
                game.genre === this.selectedGenre;

            const matchesYear =
                !this.selectedYear ||
                game.releaseYear === this.selectedYear;

            return matchesSearch && matchesGenre && matchesYear;
        });

        this.applySort();
        this.cdr.markForCheck();
    }

    private applySort(): void {
        this.filteredGames = [...this.filteredGames].sort((first, second) => {
            switch (this.selectedSort) {
                case 'name-desc':
                    return second.name.localeCompare(first.name);

                case 'year-desc':
                    return (second.releaseYear ?? 0) - (first.releaseYear ?? 0);

                case 'year-asc':
                    return (first.releaseYear ?? 0) - (second.releaseYear ?? 0);

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
        this.selectedGenre = '';
        this.selectedYear = null;
        this.selectedSort = 'name-asc';

        this.applyFilters();
    }

    goHome(): void {
        this.router.navigate(['/']);
    }

    openUpload(): void {
        this.router.navigate(['/arcade/n64/upload']);
    }

    openGame(game: ArcadeGame): void {
        this.router.navigate(['/arcade/n64/game', game.id]);
    }

    getCoverImage(game: ArcadeGame): string {
        return game.coverImage || 'assets/images/arcade/default-cover.jpg';
    }
}