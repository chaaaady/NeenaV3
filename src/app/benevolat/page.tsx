"use client";

import { useState } from "react";
import { AppBar, SideMenu, Input } from "@/components";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

export default function BenevolatPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title">Devenir bénévole</div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={name} onChange={setName} placeholder="Nom complet" leftIcon={<User size={16} />} />
              <Input value={email} onChange={setEmail} placeholder="Email" type="email" leftIcon={<Mail size={16} />} />
            </div>
            <Input value={phone} onChange={setPhone} placeholder="Téléphone" leftIcon={<Phone size={16} />} />
            <Input value={message} onChange={setMessage} placeholder="Message (disponibilités, compétences)" leftIcon={<MessageSquare size={16} />} />
            <div>
              <button className="btn-primary pressable w-full">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

