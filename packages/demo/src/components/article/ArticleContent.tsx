'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/types';
import { format } from 'date-fns';

interface ArticleContentProps {
    article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
    // Strip the first H1 from the content since we render it in the hero
    // This is a simple heuristic for the demo content which we know starts with # Title
    const contentWithoutTitle = article.content.replace(/^#\s+[^\n]+/, '').trim();

    return (
        <article className="max-w-none">
            {/* Content */}
            <div className="prose prose-light prose-lg md:prose-xl max-w-none
                prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:hidden 
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-black
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-black
                prose-h4:text-lg prose-h4:text-black prose-h5:text-black prose-h6:text-black
                prose-p:font-serif prose-p:text-[1.125rem] md:prose-p:text-[1.25rem] prose-p:leading-[1.8] prose-p:text-black prose-p:mb-8
                prose-a:text-black prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:decoration-2
                prose-strong:text-black prose-strong:font-bold
                prose-code:text-black prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                prose-pre:bg-[#1a1a1a] prose-pre:text-white prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border-0
                prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-2xl md:prose-blockquote:text-3xl prose-blockquote:leading-normal prose-blockquote:text-black prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-8 prose-blockquote:py-2 prose-blockquote:my-12
                prose-li:font-serif prose-li:text-[1.125rem] md:prose-li:text-[1.25rem] prose-li:leading-[1.8] prose-li:text-black prose-li:marker:text-black
                prose-ul:my-8 prose-ol:my-8
                prose-img:rounded-lg prose-img:shadow-sm prose-img:my-12 prose-img:w-full
                prose-hr:border-gray-200 prose-hr:my-16
            ">
                <ReactMarkdown>{contentWithoutTitle}</ReactMarkdown>
            </div>

            {/* Simple Footer */}
            <div className="mt-16 pt-12 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {article.author.avatar && (
                            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-black">{article.author.name}</p>
                        <p className="text-xs text-black/60">Published in {format(article.publishedAt, 'MMMM yyyy')}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Share/Like placeholders could go here */}
                </div>
            </div>
        </article>
    );
}
