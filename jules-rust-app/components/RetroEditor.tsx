"use client";

import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism-dark.css"; // We'll override this

interface RetroEditorProps {
    initialCode?: string;
    language?: string;
    onChange?: (code: string) => void;
    readOnly?: boolean;
}

export default function RetroEditor({
    initialCode = "// Start coding...",
    language = "rust",
    onChange,
    readOnly = false,
}: RetroEditorProps) {
    const [code, setCode] = useState(initialCode);

    const handleChange = (newCode: string) => {
        setCode(newCode);
        if (onChange) onChange(newCode);
    };

    return (
        <div className="relative font-mono rounded-lg overflow-hidden border-2 border-accent-purple shadow-[0_0_15px_rgba(126,80,163,0.4)] bg-code-bg">
            {/* Terminal Title Bar */}
            <div className="bg-accent-purple/20 border-b border-accent-purple/50 p-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-accent-purple ml-4 opacity-80">jules_assignment.rs</span>
            </div>

            {/* Editor Area */}
            <div className="p-4" style={{ minHeight: "300px" }}>
                <Editor
                    value={code}
                    onValueChange={handleChange}
                    highlight={(code) => highlight(code, languages[language] || languages.rust, language)}
                    padding={10}
                    readOnly={readOnly}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: "transparent",
                        color: "#f8f8f2",
                    }}
                    textareaClassName="focus:outline-none"
                />
            </div>

        </div>
    );
}
