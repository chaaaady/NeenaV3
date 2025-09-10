export default function MawaqitSourcePage() {
  return (
    <div className="app-container pb-12">
      <div className="app-card mt-4">
        <div className="space-y-3">
          <div className="app-title">Source: Mawaqit</div>
          <p className="text-[14px] text-[var(--text)]">
            Mawaqit est une plateforme qui fournit gratuitement les horaires de prière aux mosquées et aux fidèles.
            Les horaires affichés sur cette page proviennent de Mawaqit.
          </p>
          <p className="text-[13px] text-[var(--text-muted)]">
            Pour en savoir plus, visitez le site officiel de Mawaqit.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://mawaqit.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary pressable inline-flex items-center gap-2 px-4 py-2"
            >
              Découvrir Mawaqit
            </a>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=9MASUPX7BUYKE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary pressable inline-flex items-center gap-2 px-4 py-2"
            >
              Soutenir Mawaqit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

