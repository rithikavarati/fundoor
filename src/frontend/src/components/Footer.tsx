import { Star } from "lucide-react";
import { SiInstagram } from "react-icons/si";

const ABOUT_LINKS = [
  "About Us",
  "Contact",
  "Privacy Policy",
  "Terms of Service",
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{ background: "oklch(0.38 0.09 181)" }}
      className="text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 fill-kiddoYellow text-kiddoYellow" />
              <span className="text-2xl font-extrabold tracking-tight">
                Fun<span className="text-kiddoOrange">Door</span>
              </span>
              <Star className="w-4 h-4 fill-kiddoYellow text-kiddoYellow" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-5">
              Your one-stop destination for family-friendly fun. Discover theme
              parks, museums, local parks, and weekend activities for your
              little ones.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                data-ocid="footer.instagram.link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <SiInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* About column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">
              About
            </h4>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    data-ocid={`footer.about.${link.toLowerCase().replace(/ /g, "_")}.link`}
                    className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            &copy; {year} FunDoor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
