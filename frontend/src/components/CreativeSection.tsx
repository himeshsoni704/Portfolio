import { Reveal, SectionHeading } from './aero';
import PhotographyGallery from './PhotographyGallery';
import FilmSection from './FilmSection';

// Creative band: deliberately bright — the sky breaks into the
// deep-space theme here, then film drops the lights again.
export default function CreativeSection() {
  return (
    <section
      id="creative"
      className="noise relative scroll-mt-24"
      style={{
        background:
          'linear-gradient(180deg, #050914 0%, #0B132B 7%, #12336B 30%, #4FA8E8 58%, #BAE3FF 78%, #0B132B 100%)',
      }}
      data-testid="visual-transmissions-section"
    >
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading
          index="04"
          module="VISUAL TRANSMISSIONS"
          title="Beyond Code"
          subtitle="Because apparently computer science wasn't enough."
        />
        <PhotographyGallery />
      </div>

      {/* film drops the lights again */}
      <div
        aria-hidden="true"
        className="mt-24 h-24"
        style={{ background: 'linear-gradient(180deg, transparent 0%, #050914 100%)' }}
      />
      <div className="bg-space-950">
        <FilmSection />
      </div>
    </section>
  );
}
