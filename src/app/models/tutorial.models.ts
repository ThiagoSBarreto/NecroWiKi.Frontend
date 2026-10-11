export interface TutorialListItem {
    slug: string;
    title: string;
    category: string;
    summary: string;
    videoUrl: string | null;
    ownerId: string;
    ownerName: string;
    updatedAt: string;
}

export interface TutorialDocument extends TutorialListItem {
    markdown: string;
}