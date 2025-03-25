import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Gobering. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/avis-confidentialite" className="text-sm text-gray-500 hover:text-primary">
              Avis de confidentialités
            </Link>
            <Link href="/conditions-generales" className="text-sm text-gray-500 hover:text-primary">
              Conditions générales d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
