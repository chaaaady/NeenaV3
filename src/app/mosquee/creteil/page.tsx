"use client";

import { useState } from "react";
import { AppBar, SideMenu } from "@/components";
import { Input } from "@/components";
import { Mail, MapPin, Check, X, Car, Users, Accessibility, Languages } from "lucide-react";

const MOSQUE_NAME = "Mosquée de Créteil";
const MOSQUE_ADDRESS = "5 Rue Jean Gabin, 94000 Créteil";
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MOSQUE_ADDRESS)}`;
// Mawaqit embed (replace slug if needed)
const MAWAQIT_EMBED = "https://mawaqit.net/fr/mosquee-de-creteil?showOnlyTimes=true&embed=true";

export default function MosqueCreteilPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="app-container">
        {/* Hero */}
        <div className="app-card">
          <div className="space-y-3">
            <div className="app-title">{MOSQUE_NAME}</div>
            <div className="text-[14px] text-[var(--text-muted)] flex items-center gap-2">
              <MapPin size={16} />
              <span>{MOSQUE_ADDRESS}</span>
            </div>
            <div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary pressable inline-flex items-center gap-2 px-4 py-2"
              >
                Itinéraire
              </a>
            </div>
          </div>
        </div>

        {/* Prayer times */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Horaires de prière</div>
            <div className="section-box">
              <div className="w-full rounded-12 overflow-hidden border border-[var(--border)]">
                <iframe
                  title="Horaires Mawaqit"
                  src={MAWAQIT_EMBED}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Practical information */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Informations pratiques</div>
            <div className="grid grid-cols-2 gap-3 section-box">
              <InfoItem icon={<Car size={16} />} label="Parking" value={true} />
              <InfoItem icon={<Users size={16} />} label="Salle femmes" value={true} />
              <InfoItem icon={<Accessibility size={16} />} label="Accès PMR" value={true} />
              <InfoItem icon={<Languages size={16} />} label="Langue du khutba" text="Français" />
              <InfoItem icon={<Users size={16} />} label="Nombre de khutbas" text="2" />
            </div>
          </div>
        </div>

        {/* Become volunteer */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Devenir bénévole</div>
            <div className="text-[14px] text-[var(--text-soft)]">Contribuez à la vie de la mosquée.</div>
            <div>
              <a href="/benevolat" className="btn-primary pressable inline-flex items-center gap-2 px-4 py-2">
                Remplir le formulaire
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="app-card mt-4">
          <div className="space-y-3">
            <div className="app-title">Recevoir la newsletter</div>
            <div className="text-[14px] text-[var(--text-soft)]">Recevez le rappel et le résumé du khutba chaque vendredi.</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={newsletterEmail}
                  onChange={(v: string) => setNewsletterEmail(v)}
                  placeholder="Votre email"
                  type="email"
                  leftIcon={<Mail size={16} />}
                />
              </div>
              <button className="btn-primary pressable px-4">S'inscrire</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="app-card mt-4">
          <div className="text-[13px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {MOSQUE_NAME}. Mentions légales · Confidentialité · Contact
          </div>
        </div>
      </div>

      {/* Sticky donate button */}
      <a href="/step-amount-v2" className="sticky-donate btn-primary pressable">
        Faire un don
      </a>
    </>
  );
}

function InfoItem({ icon, label, value, text }: { icon: React.ReactNode; label: string; value?: boolean; text?: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-12">
      <div className="flex items-center gap-2 text-[14px] text-[var(--text)]">
        {icon}
        <span>{label}</span>
      </div>
      <div>
        {typeof value === "boolean" ? (
          value ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-500" />
        ) : (
          <span className="text-[14px] text-[var(--text-muted)]">{text}</span>
        )}
      </div>
    </div>
  );
}

