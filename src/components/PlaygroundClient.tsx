"use client";

import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as monaco from "monaco-editor";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "./ThemeContext";

interface RunRequest {
  code: string;
}
interface RunResponse {
  stdout: string;
  stderr: string;
  ok: boolean;
}

/** UTF-8–safe Base64 helpers (URL-safe variant for sharing) */
const encode = (s: string): string => {
  const bytes = new TextEncoder().encode(s);
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const decode = (s: string): string => {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/** Register the Ray language and simple tokenizer */
function registerRayLanguage(monacoApi: typeof import("monaco-editor")): void {
  const exists = monacoApi.languages.getLanguages().some(l => l.id === "ray");
  if (exists) return;

  monacoApi.languages.register({ id: "ray" });
  monacoApi.languages.setMonarchTokensProvider("ray", {
    defaultToken: "",
    tokenPostfix: ".ray",
    keywords: [
      "fn", "let", "const", "trait", "struct", "impl", "type",
      "return", "if", "else", "while", "for", "match", "break", "continue"
    ],
    typeKeywords: ["int", "uint", "usize", "bool", "string", "char", "void"],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "type",
            "@default": "identifier"
          }
        }],
        { include: "@whitespace" },
        [/\d+/, "number"],
        [/\"([^\"\\]|\\.)*\"/, "string"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, "operator"],
        [/[,.;]/, "delimiter"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\/.*$/, "comment"],
        [/\/\*.*\*\//, "comment"]
      ]
    }
  });
}

export default function PlaygroundClient(): JSX.Element {
  const workerRef = useRef<Worker>(null);
  // Initialize from URL param once (no setState in effect)
  const [code, setCode] = useState<string>(() => {
    if (typeof window === "undefined") {
      return `fn main() {\n  print("hello, ray");\n}`;
    }
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get("code");
    if (!encoded) return `fn main() {\n  print("hello, ray");\n}`;
    try {
      return decode(encoded);
    } catch {
      return `fn main() {\n  print("hello, ray");\n}`;
    }
  });
  const [stdout, setStdout] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [running, setRunning] = useState(false);
  const theme = useTheme();

  // Create worker once
  useEffect(() => {
    const w = new Worker(new URL("../workers/ray-runner.ts", import.meta.url), {
      type: "module"
    });
    workerRef.current = w;

    w.onmessage = (e: MessageEvent<RunResponse>) => {
      setStdout(e.data.stdout);
      setStderr(e.data.stderr);
      setRunning(false);
    };

    return () => w.terminate();
  }, []);

  // Monaco mount callback
  const handleMount: OnMount = useCallback((editor, monacoInstance) => {
    registerRayLanguage(monacoInstance as typeof monaco);
    monacoInstance.editor.setTheme(theme == "github-dark" ? "vs-dark" : "vs");
  }, [theme]);

  // Run button
  const run = useCallback(() => {
    const worker = workerRef.current;
    if (!worker) return;
    setRunning(true);
    setStdout("");
    setStderr("");
    const msg: RunRequest = { code };
    worker.postMessage(msg);
  }, [code]);

  // Share button
  const share = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("code", encode(code));
    window.history.replaceState(null, "", url.toString());
  }, [code]);

  const editor = useMemo(
    () => (
      <Editor
        height="420px"
        defaultLanguage="ray"
        value={code}
        onChange={v => setCode(v ?? "")}
        onMount={handleMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2
        }}
      />
    ),
    [code, handleMount]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium text-gray-600 dark:text-white">Editor</span>
          <div className="flex gap-2">
            <button
              onClick={share}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:text-black cursor-pointer"
              title="Update URL with ?code="
            >
              Share
            </button>
            <button
              onClick={run}
              disabled={running}
              className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-60 cursor-pointer"
            >
              {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>
        <div className="p-2">{editor}</div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-3 py-2 text-sm font-medium text-gray-600 dark:text-white">
          Output
        </div>
        <div className="grid grid-rows-[1fr_auto]">
          <pre className="m-0 h-[340px] overflow-auto bg-gray-50 p-3 text-sm leading-relaxed dark:bg-gray-700">
            {stdout || " "}
          </pre>
          {stderr ? (
            <pre className="m-0 border-t bg-red-50 p-3 text-sm text-red-700">
              {stderr}
            </pre>
          ) : (
            <div className="border-t bg-white p-2 text-xs text-gray-400 dark:bg-transparent">
              ready
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
