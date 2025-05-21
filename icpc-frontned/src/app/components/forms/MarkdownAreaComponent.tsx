"use client";
import dynamic from "next/dynamic";
import cn from "classnames";
import { TextComponent } from "../text/TextComponent";
import { commands } from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import { ICommand, TextState } from "@uiw/react-md-editor";

// Dynamic import of the MarkdownEditor component
const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor").then(mod => mod.default), { ssr: false });

interface MarkdownAreaComponentProps {
  value: string;
  onChange: (newValue?: string) => void;
  labelText?: string;
  className?: string;
}

/*
Input: a value, a function to handle the change, a label and a class name
Output: a markdown editor component
Return value: a markdown editor component to be used in a form
Function: creates a markdown editor component to be used in a form
Variables: value, onChange, labelText, className, style, toolbars, toolbarsMode
Date: 21 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const customToolbar: ICommand = {
  name: 'insertDollarBlock',
  keyCommand: 'insertDollarBlock',
  buttonProps: { 
    'aria-label': 'Wrap with dollar signs',
    style: {
      width: '20px',
      height: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0'
    }
  },
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      fill="none"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="
          M4.745 3A23.933 23.933 0 0 0 3 12
          c0 3.183.62 6.22 1.745 9
          M19.5 3c.967 2.78 1.5 5.817 1.5 9
          s-.533 6.22-1.5 9
          M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402
          l2.402 7.206a.75.75 0 0 0 1.104.401
          l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617
          l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09
        "
      />
    </svg>
  ),
  execute: (state: TextState, api: { 
    setSelectionRange: (selection: { start: number; end: number }) => void, replaceSelection: (text: string) => void }) => {
    if (!state || !api) return;

    const selectedText = state.selectedText;
    
    if (selectedText) {
      const wrappedText = `$${selectedText}$`;
      api.replaceSelection(wrappedText);
      api.setSelectionRange({
        start: state.selection.start,
        end: state.selection.start + wrappedText.length
      });
    } else {
      const insertText = '$$';
      api.replaceSelection(insertText);
      api.setSelectionRange({
        start: state.selection.start + 1,
        end: state.selection.start + 1
      });
    }
  }
};

export default function MarkdownAreaComponent({ value, onChange, labelText, className }: Readonly<MarkdownAreaComponentProps>) {
  const style = cn(className, "w-full");

  return (
    <div className="w-full">
      {labelText != undefined ? <TextComponent className="dark:text-dark-accent self-start">{labelText}</TextComponent> : <></>}
      <MarkdownEditor
        key="texMath"
        className={style}
        value={value}
        height="320px"
        onChange={onChange}
        commands={[...commands.getCommands(), customToolbar]} // Add custom toolbar here
        previewOptions={{
          components: {
            code: ({ children = [], className, ...props }) => {
              // Ensure `code` is always a string
              const code = props.node && props.node.children ? getCodeString(props.node.children) : (children || "");

              // Handle block math with `KaTeX` syntax, e.g., ```KaTeX
              if (typeof className === "string" && /^language-katex/.test(className.toLowerCase())) {
                const html = katex.renderToString(code.toString(), {
                  throwOnError: false,
                  displayMode: true  // Ensure it's rendered as block math
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} style={{ fontSize: "150%" }} />;
              }

              // Handle inline KaTeX with $$...$$
              if (typeof children === "string" && /^\$\$(.*)\$\$/.test(children)) {
                const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, "$1"), {
                  throwOnError: false,
                  displayMode: true // Renders it as block math
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: "transparent" }} />;
              }

              return <code className={String(className)}>{children}</code>;
            }
          }
        }}
      />
    </div>
  );
}
