import React from 'react';

interface SimpleMarkdownProps {
    content: string;
}

export default function SimpleMarkdown({ content }: SimpleMarkdownProps) {
    if (!content) return null;

    // Split content by code blocks
    // This simple regex handles ```language \n code \n ``` blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="space-y-4 font-sans text-gray-300 leading-relaxed text-sm">
            {parts.map((part, index) => {
                if (part.startsWith("```")) {
                    // Extract language and code
                    const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
                    if (match) {
                        const [, language, code] = match;
                        return (
                            <div key={index} className="my-4 rounded-md overflow-hidden border border-accent-purple/30 bg-black/50">
                                {language && (
                                    <div className="bg-white/5 px-4 py-1 text-xs text-gray-400 border-b border-white/5 uppercase tracking-wider">
                                        {language}
                                    </div>
                                )}
                                <pre className="p-4 overflow-x-auto text-accent-cyan font-mono text-xs">
                                    <code>{code.trim()}</code>
                                </pre>
                            </div>
                        );
                    }
                }

                // Regular text: handle newlines as distinct paragraphs or breaks
                return (
                    <div key={index}>
                        {part.split('\n').map((line, i) => (
                            <p key={i} className="min-h-[1em] mb-2 last:mb-0">
                                {line}
                            </p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
