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

import { ArcadeGame } from '../../../models/arcade.models/arcade.game.model';

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

    games: ArcadeGame[] = [];
    filteredGames: ArcadeGame[] = [];

    searchTerm: string = '';
    selectedGenre: string = '';
    selectedYear: number | null = null;
    selectedSort: string = 'name-asc';

    genres: string[] = [];
    years: number[] = [];

    loading: boolean = false;

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
        ps1: {
            id: 'ps1',
            label: 'PlayStation',
            icon: '/images/ps1.png'
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
        private readonly cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const systemKey = (params.get('system') ?? 'n64').toLowerCase();
            const normalizedSystemKey = systemKey === 'ps1' ? 'psx' : systemKey;

            this.systemId = systemKey;
            this.systemMeta = this.systemMap[systemKey] ?? this.systemMap[normalizedSystemKey] ?? this.systemMap['n64'];

            this.games = this.loadGamesForSystem(normalizedSystemKey);
            this.loadFilters();
            this.applyFilters();
            this.cdr.markForCheck();
        });
    }

    private loadGamesForSystem(systemId: string): ArcadeGame[] {
        switch (systemId) {
            case 'snes':
                return [
                    {
                        id: 1,
                        systemId: 'snes',
                        name: 'Super Mario World',
                        description: 'Clássica jornada pelo mundo do cogumelo.',
                        genre: 'Plataforma',
                        releaseYear: 1990,
                        developer: 'Nintendo EAD',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/snes/super-mario-world.jpg',
                        romFileName: 'Super Mario World.smc'
                    },
                    {
                        id: 2,
                        systemId: 'snes',
                        name: 'The Legend of Zelda: A Link to the Past',
                        description: 'Uma aventura épica cheia de mistérios.',
                        genre: 'Aventura',
                        releaseYear: 1991,
                        developer: 'Nintendo EAD',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/snes/link-to-the-past.jpg',
                        romFileName: 'Zelda A Link To The Past.smc'
                    },
                    {
                        id: 3,
                        systemId: 'snes',
                        name: 'Super Metroid',
                        description: 'Exploração espacial com atmosfera intensa.',
                        genre: 'Ação',
                        releaseYear: 1994,
                        developer: 'Nintendo R&D1',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/snes/super-metroid.jpg',
                        romFileName: 'Super Metroid.smc'
                    }
                ];
            case 'gba':
                return [
                    {
                        id: 1,
                        systemId: 'gba',
                        name: 'Pokemon FireRed',
                        description: 'Aventura de captura e evolução.',
                        genre: 'RPG',
                        releaseYear: 2004,
                        developer: 'Game Freak',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/gba/pokemon-firered.jpg',
                        romFileName: 'Pokemon FireRed.gba'
                    },
                    {
                        id: 2,
                        systemId: 'gba',
                        name: 'Advance Wars',
                        description: 'Estratégia tática em grade.',
                        genre: 'Estratégia',
                        releaseYear: 2001,
                        developer: 'Intelligent Systems',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/gba/advance-wars.jpg',
                        romFileName: 'Advance Wars.gba'
                    },
                    {
                        id: 3,
                        systemId: 'gba',
                        name: 'Super Mario Advance 2',
                        description: 'Versão portátil de um clássico.',
                        genre: 'Plataforma',
                        releaseYear: 2001,
                        developer: 'Nintendo',
                        publisher: 'Nintendo',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: 'Livre',
                        coverImage: 'assets/images/arcade/gba/super-mario-advance-2.jpg',
                        romFileName: 'Super Mario Advance 2.gba'
                    }
                ];
            case 'psx':
            case 'ps1':
                return [
                    {
                        id: 1,
                        systemId: 'ps1',
                        name: 'Castlevania: Symphony of the Night',
                        description: 'Uma jornada sombria e metroidvania.',
                        genre: 'Ação',
                        releaseYear: 1997,
                        developer: 'Konami',
                        publisher: 'Konami',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: '12 anos',
                        coverImage: 'assets/images/arcade/psx/castlevania-sotn.jpg',
                        romFileName: 'Castlevania Symphony of the Night.bin'
                    },
                    {
                        id: 2,
                        systemId: 'ps1',
                        name: 'Final Fantasy VII',
                        description: 'RPG clássico com narrativa marcante.',
                        genre: 'RPG',
                        releaseYear: 1997,
                        developer: 'Square',
                        publisher: 'Square',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: '12 anos',
                        coverImage: 'assets/images/arcade/psx/final-fantasy-vii.jpg',
                        romFileName: 'Final Fantasy VII.bin'
                    },
                    {
                        id: 3,
                        systemId: 'ps1',
                        name: 'Resident Evil 2',
                        description: 'Sobrevivência e terror em um cenário urbano.',
                        genre: 'Terror',
                        releaseYear: 1998,
                        developer: 'Capcom',
                        publisher: 'Capcom',
                        region: 'USA',
                        language: 'Inglês',
                        ageRating: '16 anos',
                        coverImage: 'assets/images/arcade/psx/resident-evil-2.jpg',
                        romFileName: 'Resident Evil 2.bin'
                    }
                ];
            case 'n64':
            default:
                return [
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
                    }
                ];
        }
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
        this.router.navigate([`/arcade/${this.systemId}/upload`]);
    }

    openGame(game: ArcadeGame): void {
        this.router.navigate(['/arcade', this.systemId, 'game', game.id]);
    }

    getCoverImage(game: ArcadeGame): string {
        return game.coverImage || 'assets/images/arcade/default-cover.jpg';
    }
}
