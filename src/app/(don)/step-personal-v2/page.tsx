"use client";

import React from "react";
import { DonationFormProvider } from "@/components/DonationFormProvider";

export default function StepPersonalV2Page() {
  return (
    <DonationFormProvider>
      <main className="app-container">
        <div className="app-card">
          <div className="app-title">Informations personnelles</div>
          <p className="text-[13px] text-[var(--text-muted)]">Page en cours de chargement…</p>
        </div>
      </main>
    </DonationFormProvider>
  );
}

