import { Github, Linkedin, Mail } from 'lucide-react';
import { SITE } from '../lib/site';

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.18em] text-ice">HIMESH SONI</p>
          <p className="mt-1 text-sm text-mist">Built with curiosity.</p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-mist/70">© 2026</p>
        <div className="flex items-center gap-6">
          <a
            data-testid="footer-github"
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-mist transition-colors hover:text-ice"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            data-testid="footer-linkedin"
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-mist transition-colors hover:text-ice"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            data-testid="footer-email"
            href={`mailto:${SITE.email}`}
            aria-label="Email"
            className="text-mist transition-colors hover:text-ice"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
