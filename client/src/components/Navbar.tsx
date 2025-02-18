import { Link, useLocation } from "wouter";
import { Home, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button
            variant={location === "/" ? "default" : "ghost"}
            size="icon"
            className="rounded-full w-10 h-10"
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/liked">
          <Button
            variant={location === "/liked" ? "default" : "ghost"}
            size="icon"
            className="rounded-full w-10 h-10"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Liked Podcasts</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}