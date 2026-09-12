export interface ArcadeGame {
    id: number;
    systemId: string;
    name: string;
    description?: string;
    genre?: string;
    releaseYear?: number;
    developer?: string;
    publisher?: string;
    region?: string;
    language?: string;
    ageRating?: string;
    coverImage?: string;
    romFileName: string;
}