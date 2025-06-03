'use client'
import React, { useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import Prism from 'prismjs';
import '../css/prism.css';

/*
Input: body (string)
Output: Props for MarkdownBodyComponent
Return value: MarkdownBodyComponentProps interface
Function: Describes the properties for the MarkdownBodyComponent
Variables: body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface MarkdownBodyComponentProps {
  body: string;
}

/*
Input: body (from MarkdownBodyComponentProps)
Output: Renders markdown content as HTML with syntax highlighting
Return value: React Node (markdown-rendered component)
Function: Renders markdown content using MDXRemote and highlights code blocks with Prism.js
Variables: body, useEffect, Prism
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
function MarkdownBodyComponent({ body }: Readonly<MarkdownBodyComponentProps>) {
  // Effect hook to highlight code blocks using Prism.js
  useEffect(() => {
    Prism.highlightAll();
  }, [body]);

  return (
    <div
      className={`w-full prose text-accent dark:text-dark-accent
      [&_a]:text-dark-accent [&_a]:dark:text-dark-complementary
      prose-headings:dark:text-dark-accent
      [&_img]:m-auto
      prose-strong:dark:text-dark-accent
      prose-blockquote:dark:text-dark-accent max-w-max
      text-justify`}
    >
      <MDXRemote
        compiledSource={body}
        scope={{}}
        frontmatter={{}}
        components={{
          code({ className, children }) {
            const language = className?.replace('language-', '') || 'plaintext';
            return (
              <pre className={`language-${language}`}>
                <code className={`language-${language}`}>
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            );
          }
        }}
      />
    </div>
  );
}

export default MarkdownBodyComponent;