import type { Metadata } from "next"
import FormWizard from "@/components/form-wizard"

export const metadata: Metadata = {
  title: "Underground - Escuela de Música",
  description: "Filtro de consultas para clases de música en Underground",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormWizard />
      </div>
    </main>
  )
}
