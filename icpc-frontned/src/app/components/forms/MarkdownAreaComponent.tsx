"use client";
import dynamic from "next/dynamic";
import cn from "classnames";
import { TextComponent } from "../text/TextComponent";
import { commands } from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";

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
        commands={[...commands.getCommands()]}
        previewOptions={{
          components: {
            code: ({ children = [], className, ...props }) => {
              // Ensure `code` is always a string
              const code = props.node && props.node.children ? getCodeString(props.node.children) : (children || "");

              // Handle block math with `KaTeX` syntax, e.g., ```KaTeX
              if (typeof className === "string" && /^language-katex/.test(className.toLowerCase())) {
                const html = katex.renderToString(code.toString(), {
                  throwOnError: false,
                  displayMode: true,  // Ensure it's rendered as block math
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} style={{ fontSize: "150%" }} />;
              }

              // Handle inline KaTeX with $$...$$
              if (typeof children === "string" && /^\$\$(.*)\$\$/.test(children)) {
                const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, "$1"), {
                  throwOnError: false,
                  displayMode: true, // Renders it as block math
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: "transparent" }} />;
              }

              return <code className={String(className)}>{children}</code>;
            },
          },
        }}
      />
    </div>
  );
}
