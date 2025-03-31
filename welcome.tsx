import { Search } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PublicLayout from "./components/public/public-layout"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
  const router = useRouter()
  return (
    <div>
      <PublicLayout>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none text-primary">
                    Trouvez des professionnels près de chez vous
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Gobering est une plateforme de prise et de gestion de rendez-vous en ligne. Elle permet aux
                    utilisateurs de planifier, confirmer et suivre leurs rendez-vous facilement, tout en offrant des
                    outils pratiques pour organiser leur emploi du temps de manière efficace.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-8 lg:mt-0">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Appointment Management"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl/tight text-primary">
                  Commencez votre recherche
                </h2>
                <p className="text-gray-500 md:text-xl dark:text-gray-400">
                  Trouvez le professionnel idéal en quelques clics
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:gap-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Localisation
                  </label>
                  <div className="relative">
                    <Input id="location" placeholder="Ville ou code postal" className="pl-10" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profession"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Profession
                  </label>
                  <div className="relative">
                    <Input id="profession" placeholder="Type de professionnel" className="pl-10" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button onClick={() => router.push('/recherche-professionnels')} className="w-full md:w-auto" size="lg">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl/tight text-primary">
                  Professions les plus recherchées
                </h2>
                <p className="text-gray-500 md:text-xl dark:text-gray-400">
                  Découvrez les spécialistes les plus demandés sur notre plateforme
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
                        <path d="M3.69 8.56A9 9 0 0 0 3 12" />
                        <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                        <path d="M8.56 20.31A9 9 0 0 0 12 21" />
                        <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
                        <path d="M20.31 15.44A9 9 0 0 0 21 12" />
                        <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
                        <path d="M15.44 3.69A9 9 0 0 0 12 3" />
                        <path d="M12 12v-2" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Médecin</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Généraliste & Spécialiste</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les médecins disponibles">
                    <span className="sr-only">Voir les médecins disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M2 22 8 9 14 22" />
                        <path d="m7 14 5-1" />
                        <path d="M22 9a5 5 0 0 0-5-5" />
                        <path d="M17 4v6" />
                        <path d="M17 10h-5" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Dentiste</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Soins & Esthétique</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les dentistes disponibles">
                    <span className="sr-only">Voir les dentistes disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Ostéopathe</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Manipulation & Thérapie</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les ostéopathes disponibles">
                    <span className="sr-only">Voir les ostéopathes disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M14 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
                        <path d="M13.4 3H10.6a.6.6 0 0 0-.6.6v2.8a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6Z" />
                        <path d="M8 16h.01" />
                        <path d="M12 16h.01" />
                        <path d="M16 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Kinésithérapeute</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Rééducation & Massage</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les kinésithérapeutes disponibles">
                    <span className="sr-only">Voir les kinésithérapeutes disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M2 3h20" />
                        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                        <path d="m7 21 5-5 5 5" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Psychologue</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Thérapie & Consultation</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les psychologues disponibles">
                    <span className="sr-only">Voir les psychologues disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
                        <polyline points="14 2 14 8 20 8" />
                        <circle cx="8" cy="16" r="6" />
                        <path d="M9.5 17.5 8 16.25V14" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Nutritionniste</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Diététique & Conseil</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les nutritionnistes disponibles">
                    <span className="sr-only">Voir les nutritionnistes disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Dermatologue</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Peau & Traitement</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les dermatologues disponibles">
                    <span className="sr-only">Voir les dermatologues disponibles</span>
                  </a>
                </div>

                <div className="group relative rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">Ophtalmologue</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Vision & Diagnostic</p>
                  </div>
                  <a href="#" className="absolute inset-0" aria-label="Voir les ophtalmologues disponibles">
                    <span className="sr-only">Voir les ophtalmologues disponibles</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      </PublicLayout>
    </div>
  )
}
