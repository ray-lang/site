/// <reference lib="webworker" />

export interface RunRequest {
  code: string;
}

export interface RunResponse {
  stdout: string;
  stderr: string;
  ok: boolean;
}

/** Naive mock: extract strings inside print("...") calls */
function mockRunRay(code: string): RunResponse {
  const re = /print\s*\(\s*"([^"]*)"\s*\)\s*;?/g;
  const lines: string[] = [];
  for (const match of code.matchAll(re)) {
    lines.push(match[1]);
  }
  const stdout = lines.length ? lines.join("\n") : "[mock] program ran (no print)";
  return { stdout, stderr: "", ok: true };
}

self.onmessage = (e: MessageEvent<RunRequest>): void => {
  try {
    const result = mockRunRay(e.data.code);
    self.postMessage(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const failure: RunResponse = { stdout: "", stderr: message, ok: false };
    self.postMessage(failure);
  }
};

// Make this a module (avoids global script mode issues)
export {};
