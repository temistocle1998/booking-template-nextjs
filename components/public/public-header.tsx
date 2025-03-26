import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PublicHeader() {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Fermer le menu lorsque l'écran devient plus grand que md
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsMenuOpen(false)
        }
      }
  
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    // Empêcher le défilement du body lorsque le menu mobile est ouvert
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
      return () => {
        document.body.style.overflow = "auto"
      }
    }, [isMenuOpen])
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    }
  
    const closeMenu = () => {
      setIsMenuOpen(false)
    }
  
  return (
    //   <header className="border-b bg-white sticky top-0 z-50">
    //     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex h-16 items-center justify-between">
    //         <div className="flex items-center">
    //           <Link href="/" className="flex items-center font-bold text-xl text-primary">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="24"
    //               height="24"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="mr-2 h-6 w-6"
    //             >
    //               <rect width="18" height="18" x="3" y="3" rx="2" />
    //               <path d="M8 12h8" />
    //               <path d="M12 8v8" />
    //             </svg>
    //             Gobering
    //           </Link>
    //         </div>
    //         <nav className="hidden md:flex space-x-8">
    //           <Link href="/" className="text-primary font-medium hover:text-primary/80">
    //             Accueil
    //           </Link>
    //           <Link href="/tarifs" className="text-gray-500 font-medium hover:text-primary">
    //             Tarifs
    //           </Link>
    //           <Link href="/contact" className="text-gray-500 font-medium hover:text-primary">
    //             Contact
    //           </Link>
    //         </nav>
    //         <div className="hidden md:block">
    //         <Button variant="outline" className="w-full">
    //             Je suis un professionnel
    //           </Button>
    //         </div>
    //         <div className="md:hidden">
    //           <button
    //             type="button"
    //             className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    //             aria-expanded="false"
    //           >
    //             <span className="sr-only">Open main menu</span>
    //             <svg
    //               className="block h-6 w-6"
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               aria-hidden="true"
    //             >
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    //             </svg>
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="hidden md:hidden">
    //       <div className="space-y-1 px-2 pb-3 pt-2">
    //         <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-primary">
    //           Accueil
    //         </Link>
    //         <Link
    //           href="/tarifs"
    //           className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary"
    //         >
    //           Tarifs
    //         </Link>
    //         <Link
    //           href="/contact"
    //           className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary"
    //         >
    //           Contact
    //         </Link>
    //         <div className="pt-2">
    //           <Button variant="outline" onClick={() => router.push('/example')} className="w-full">
    //             Je suis un professionnel
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </header>
    <header className="border-b bg-white sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center font-bold text-xl text-primary">
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
              className="mr-2 h-6 w-6"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            Gobering
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-primary font-medium hover:text-primary/80">
            Accueil
          </Link>
          <Link href="/tarifs" className="text-gray-500 font-medium hover:text-primary">
            Tarifs
          </Link>
          <Link href="/contact" className="text-gray-500 font-medium hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="hidden md:block">
          <Button onClick={() => router.push('/landing-page')}  variant="outline" className="ml-4">
            Je suis un professionnel
          </Button>
        </div>
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            <span className="sr-only">{isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Menu mobile avec animation */}
    <div
      className={`fixed inset-0 z-40 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ top: "64px" }}
    >
      <div className="flex flex-col h-full overflow-y-auto pb-12 pt-2 shadow-xl">
        <div className="space-y-1 px-4">
          <Link
            href="/"
            className="block rounded-md py-3 text-base font-medium text-primary border-b"
            onClick={closeMenu}
          >
            Accueil
          </Link>
          <Link
            href="/tarifs"
            className="block rounded-md py-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary border-b"
            onClick={closeMenu}
          >
            Tarifs
          </Link>
          <Link
            href="/contact"
            className="block rounded-md py-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary border-b"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <div className="pt-4">
            <Button variant="outline" onClick={() => router.push('/landing-page')}  className="w-full">
              Je suis un professionnel
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Overlay sombre quand le menu est ouvert */}
    {isMenuOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
        aria-hidden="true"
        onClick={closeMenu}
        style={{ top: "64px" }}
      />
    )}
  </header>
  )
}

