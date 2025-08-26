import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app-container">
      <div className="app-card">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Page non trouvée</h1>
          <p className="text-[var(--text-muted)]">
            La page que vous recherchez n&apos;existe pas.
          </p>
          <Link 
            href="/" 
            className="btn-primary pressable inline-block px-6 py-3 text-[16px] font-[700]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
} 