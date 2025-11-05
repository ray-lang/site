import Link from "next/link";

import RayCode from "@/components/RayCode";

export default function Home() {
  return (
    <section className="relative mx-auto max-w-5xl py-8">
      <h1
        className="font-barlow-800i mb-4 text-8xl font-bold"
      >
        RAY
      </h1>
      <p className="mb-10 text-xl text-gray-600 max-w-2xl dark:text-white/70">
        A WASM-first systems language with strong types and pragmatic tooling.
      </p>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/playground"
          className="rounded-lg border border-gray-300 px-8 py-4 text-lg font-medium hover:bg-gray-50 dark:hover:text-slate-900"
        >
          Try the Playground
        </Link>
        <Link
          href="/docs"
          className="rounded-lg bg-black px-10 py-4 text-lg font-medium text-white hover:bg-slate-800"
        >
          Read the Docs
        </Link>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <h3 className="mb-2 font-semibold">WASM first</h3>
          <p className="text-sm text-gray-600 dark:text-white/70">Small, predictable builds for web and edge.</p>
        </div>
        <div className="rounded-lg border p-5">
          <h3 className="mb-2 font-semibold">Strong types</h3>
          <p className="text-sm text-gray-600 dark:text-white/70">Inference where it helps, explicit where it counts.</p>
        </div>
        <div className="rounded-lg border p-5">
          <h3 className="mb-2 font-semibold">Modern tooling</h3>
          <p className="text-sm text-gray-600 dark:text-white/70">CLI, LSP, and a simple package model.</p>
        </div>
      </div>

      <div className="mt-16 rounded-lg border p-5">
        <h2 className="mb-3 text-lg font-semibold">Example</h2>
        <div className="mt-6 rounded-md border text-sm overflow-hidden">
          <RayCode code={`fn main() {\n    print("hello, ray")\n}`} />
        </div>
      </div>
    </section>
  )
}
