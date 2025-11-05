"use client";

import { highlightRay } from "@/lib/highlightRay";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

export default function RayCode({ code }: { code: string }) {
  const [html, setHtml] = useState("");
  const theme = useTheme();
  
  useEffect(() => {
    highlightRay(code, theme).then(setHtml);
  }, [code, theme]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
