export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
    };
    publishedAt: Date;
    readingTime: string;
    coverImage: string;
    tags: string[];
    priceInLamports: bigint;
    isPremium: boolean;
    mode?: 'sovereign' | 'platform' | 'hybrid' | 'payai';
}
