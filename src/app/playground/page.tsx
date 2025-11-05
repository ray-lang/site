import PlaygroundClient from "@/components/PlaygroundClient";

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  return (
    <section className="mx-auto max-w-6xl py-10">
      <h1 className="mb-4 text-3xl font-bold">Playground</h1>
      <p className="mb-6 text-gray-600">Write Ray code, then run it. (Runner is mocked for now.)</p>
      <PlaygroundClient />
    </section>
  )
}
