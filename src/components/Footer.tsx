import { MessageCircle, Mail } from "lucide-react";
import { handleAction } from "@/utils/actionHandler";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-DEFAULT text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Web Development for <span className="text-secondary-DEFAULT">$15</span>
            </h3>
            <p className="text-white/70 max-w-md">
              Professional websites without the professional price tag. One flat
              fee, free hosting, and revisions included.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/923461115757"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAction("link_click", { link_id: "footer_whatsapp" })}
              className="inline-flex items-center gap-2 text-white/80 hover:text-secondary-DEFAULT transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:hello@applytocollege.pk"
              onClick={() => handleAction("link_click", { link_id: "footer_email" })}
              className="inline-flex items-center gap-2 text-white/80 hover:text-secondary-DEFAULT transition-colors"
            >
              <Mail className="w-5 h-5" />
              hello@applytocollege.pk
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/50 text-sm">
          © {year} Web Development for $15. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
