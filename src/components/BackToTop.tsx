import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { handleAction } from "@/utils/actionHandler";

// Floating "back to top" control. On a long single-page site the pricing CTA
// lives near the bottom; this lets a scrolled-down visitor jump straight back
// to the hero call-to-action without a long manual scroll. It stays hidden
// until the user has scrolled a full viewport so it never crowds the hero.
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once in case the page loads already scrolled (e.g. on refresh).
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    handleAction("button_click", { button_id: "back_to_top" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-[160px] right-[30px] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-DEFAULT text-black shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-DEFAULT animate-fade-in"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
