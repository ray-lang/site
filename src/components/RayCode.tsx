"use client";

import { highlightRay } from "@/lib/highlightRay";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function RayCode({ code }: { code: string }) {
  const [html, setHtml] = useState("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    highlightRay(code, resolvedTheme === "dark" ? "github-dark" : "github-light").then(setHtml);
  }, [code, resolvedTheme]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
