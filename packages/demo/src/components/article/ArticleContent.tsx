'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/types';
import { format } from 'date-fns';

interface ArticleContentProps {
    article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
    return (
        <article className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight font-sans">
                    {article.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-8">
                    {/* Author Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium overflow-hidden">
                        {article.author.avatar ? (
                            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg">{article.author.name.charAt(0)}</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{article.author.name}</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <button className="text-green-600 text-sm hover:underline">Follow</button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{article.readingTime} read</span>
                            <span>·</span>
                            <time dateTime={article.publishedAt.toISOString()}>
                                {format(article.publishedAt, 'MMM d, yyyy')}
                            </time>
                            {article.isPremium && (
                                <>
                                    <span>·</span>
                                    <span className="text-yellow-500 flex items-center gap-1">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        Member-only
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subtitle/Description handled by first paragraph usually, but if tags exist: */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                        {article.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none
                prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                prose-h1:text-4xl prose-h1:mb-8
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:font-serif prose-p:text-xl prose-p:leading-8 prose-p:text-gray-800 prose-p:mb-8
                prose-a:text-gray-900 prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:decoration-2
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:leading-9 prose-blockquote:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-10
                prose-li:font-serif prose-li:text-xl prose-li:text-gray-800 prose-li:marker:text-gray-400
                prose-img:rounded-sm prose-img:my-12
                prose-hr:border-gray-200 prose-hr:my-12
            ">
                <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                            {article.author.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Written by {article.author.name}</p>
                            <p className="text-sm text-gray-500">Thank you for reading!</p>
                        </div>
                    </div>
                </div>
            </footer>
        </article>
    );
}
