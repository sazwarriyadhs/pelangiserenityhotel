import { Hotel } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-primary transition-transform duration-300 hover:scale-105">
          <Hotel className="h-6 w-6" />
          <span className="text-2xl font-headline">Tranquil Stays</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="#rooms" className="transition-colors hover:text-primary">Rooms</Link>
          <Link href="#booking" className="transition-colors hover:text-primary">Booking</Link>
          <Link href="#concierge" className="transition-colors hover:text-primary">Concierge</Link>
        </nav>
      </div>
    </header>
  );
}
