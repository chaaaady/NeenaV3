"use client";

import { Menu, ChevronRight, Info, X, Settings, HelpCircle, Shield, ArrowRight, RotateCcw, CreditCard, Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useState, useEffect } from "react";

export function AppBar({ title = "Neena", onMenu }: { title?: string; onMenu?: () => void }) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMenu) {
      onMenu();
    }
  };

  return (
    <div className="app-header">
      <div className="header-content">
        {/* Titre Apple-style */}
                  <div className="font-[800] text-[20px] leading-[24px] tracking-[-0.3px] text-[var(--text)]">
            {title}
          </div>

        {/* Burger Menu Apple-style */}
        <button
          aria-label="menu"
          onClick={handleMenuClick}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMenuPressed(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsMenuPressed(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsMenuPressed(false);
          }}
          className={cn(
            "relative w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center transition-all duration-200 ease-out",
            "hover:bg-[var(--surface-2)] active:bg-[var(--border)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2",
            isMenuPressed && "scale-95"
          )}
        >
          {/* Burger lines avec animation */}
          <div className="relative w-5 h-5 flex flex-col justify-center items-center">
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full mt-1 transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full mt-1 transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
          </div>
        </button>
      </div>
    </div>
  );
}

export function ProductHeader({ 
  currentMosque, 
  onMosqueSelect, 
  onInfoNavigation 
}: { 
  currentMosque?: string;
  onMosqueSelect?: () => void;
  onInfoNavigation?: () => void;
}) {
  return (
    <div className="product-header">
      <div className="product-header-content">
        {/* Espace vide à gauche pour équilibrer */}
        <div className="w-20" />
        
        {/* Mosquée centrée */}
        <button
          onClick={onMosqueSelect}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] hover:bg-[var(--surface-2)] transition-colors"
        >
          <span className="text-[15px] font-[600] text-[var(--text)]">
            {currentMosque || "Sélectionner une mosquée"}
          </span>
        </button>

        {/* Info à droite */}
        <button
          onClick={onInfoNavigation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--brand)] text-white text-[13px] font-[600] hover:bg-[var(--brand)]/90 transition-colors"
        >
          <Info size={14} />
          Info
        </button>
      </div>
    </div>
  );
}

export function MosqueSelectorModal({ 
  isOpen, 
  onClose, 
  currentMosque,
  onMosqueSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  currentMosque?: string;
  onMosqueSelect: (mosque: string) => void;
}) {
  // Gestion simplifiée sans overlay problématique
  useEffect(() => {
    if (isOpen) {
      // Prévenir le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
      
      // Fermer la modal si on clique en dehors
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        const modalElement = document.getElementById('mosque-selector-modal');
        if (modalElement && !modalElement.contains(target)) {
          onClose();
        }
      };
      
      // Ajouter l'événement après un délai pour éviter la fermeture immédiate
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('click', handleClickOutside);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mosquesIleDeFrance = [
    "Créteil", "Grande Mosquée de Paris", "Mosquée de Bobigny",
    "Mosquée de Saint-Denis", "Mosquée de Nanterre", "Mosquée de Argenteuil",
    "Mosquée de Montreuil", "Mosquée de Vitry-sur-Seine",
    "Mosquée de Champigny-sur-Marne", "Mosquée de Meaux",
    "Mosquée de Évry-Courcouronnes", "Mosquée de Corbeil-Essonnes",
    "Mosquée de Mantes-la-Jolie", "Mosquée de Pontoise",
    "Mosquée de Melun", "Mosquée de Drancy", "Mosquée de Aubervilliers",
    "Mosquée de La Courneuve", "Mosquée de Sarcelles",
    "Mosquée de Villiers-sur-Marne"
  ];

  return (
    <div 
      id="mosque-selector-modal"
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[var(--radius-all)] shadow-2xl z-50",
        "border border-[var(--border)]",
        "transition-all duration-200 ease-out",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      )}
      onClick={(e) => e.stopPropagation()}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-[20px] font-[700] text-[var(--text)]">Sélectionner une mosquée</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
          >
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Liste des mosquées */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {mosquesIleDeFrance.map((mosque) => (
              <button
                key={mosque}
                onClick={(e) => {
                  e.stopPropagation();
                  onMosqueSelect(mosque);
                  onClose();
                }}
                className={cn(
                  "w-full text-left p-4 rounded-[var(--radius-all)] border transition-all duration-150 ease-in-out",
                  currentMosque === mosque
                    ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]/30 hover:bg-[var(--brand)]/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-[var(--radius-all)] flex items-center justify-center",
                    currentMosque === mosque ? "bg-[var(--brand)]" : "bg-[var(--surface-2)]"
                  )}>
                    <span className={cn(
                      "font-[700] text-[12px]",
                      currentMosque === mosque ? "text-white" : "text-[var(--text-muted)]"
                    )}>
                      M
                    </span>
                  </div>
                  <span className="text-[16px] font-[600]">{mosque}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
    </div>
  );
}

export function SideMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Gestion simplifiée sans overlay problématique
  useEffect(() => {
    if (isOpen) {
      // Prévenir le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden';
      
      // Fermer le menu si on clique en dehors
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        const menuElement = document.getElementById('side-menu');
        if (menuElement && !menuElement.contains(target)) {
          onClose();
        }
      };
      
      // Ajouter l'événement après un délai pour éviter la fermeture immédiate
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('click', handleClickOutside);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="side-menu"
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50",
        "border-l border-[var(--border)]",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header du menu */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <h2 className="text-[20px] font-[700] text-[var(--text)]">Menu</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
        >
          <X size={20} className="text-[var(--text-muted)]" />
        </button>
      </div>

      {/* Contenu du menu */}
      <div className="p-4 space-y-2">
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center gap-3 p-4 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left"
        >
          <Settings size={20} className="text-[var(--text-muted)]" />
          <span className="text-[16px] font-[600] text-[var(--text)]">Paramètres</span>
        </button>
        
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center gap-3 p-4 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left"
        >
          <HelpCircle size={20} className="text-[var(--text-muted)]" />
          <span className="text-[16px] font-[600] text-[var(--text)]">Aide</span>
        </button>
        
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center gap-3 p-4 rounded-[var(--radius-all)] hover:bg-[var(--surface-2)] transition-colors text-left"
        >
          <Shield size={20} className="text-[var(--text-muted)]" />
          <span className="text-[16px] font-[600] text-[var(--text)]">Confidentialité</span>
        </button>
      </div>
    </div>
  );
}

export function Stepper({ activeStep = 0 }: { activeStep?: number }) {
  const steps = ["Amount", "Info", "Payment"];
  
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div key={step} className="stepper-item">
          <div className={cn("stepper-dot", index === activeStep && "active")} />
          <span className={cn("stepper-label", index === activeStep && "active")}>
            {step}
          </span>
          {index < steps.length - 1 && <div className="stepper-connector" />}
        </div>
      ))}
    </div>
  );
}

export function PageTransition({ 
  children, 
  isVisible = true,
  onTransitionComplete
}: { 
  children: React.ReactNode; 
  isVisible?: boolean;
  onTransitionComplete?: () => void;
}) {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('entered');

  useEffect(() => {
    if (isVisible) {
      setAnimationState('entering');
      setTimeout(() => {
        setAnimationState('entered');
        onTransitionComplete?.();
      }, 240);
    } else {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 240);
    }
  }, [isVisible, onTransitionComplete]);

  if (animationState === 'exited') return null;

  return (
    <div 
      className={cn(
        "page-transition",
        animationState === 'entering' && "slide-in",
        animationState === 'exiting' && "slide-out"
      )}
    >
      {children}
    </div>
  );
}

export function AnimatedCard({ 
  children, 
  className, 
  isVisible = true,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  isVisible?: boolean;
  delay?: number;
}) {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationState('entering');
        setTimeout(() => setAnimationState('entered'), 240); // Durée de l'animation
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 240);
    }
  }, [isVisible, delay]);

  if (animationState === 'exited') return null;

  return (
    <div 
      className={cn(
        "card-container app-card",
        animationState === 'entering' && "entering",
        animationState === 'exiting' && "exiting",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CollapsibleStepCard({
  title,
  summaryValue,
  isActive,
  isCompleted,
  children,
  className,
  delay = 0,
  onClick
}: {
  title: string;
  summaryValue?: string;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  // Gestion d'état simplifiée - juste ouvert/fermé
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Petit délai pour éviter l'apparition trop brusque au chargement initial
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady) return null;

  // Mode résumé (carte fermée) - même structure que SummaryRow
  if (!isActive) {
    return (
      <button 
        className={cn("summary-row w-full text-[16px] transition-all duration-200 ease-in-out", className)}
        onClick={onClick}
        aria-label={`${title} ${summaryValue || "Add"}`}
      >
        <span className="text-[var(--text-muted)] font-[700] text-[16px]">{title}</span>
        <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[16px]">
          {summaryValue || "Add"}
          {onClick && <ChevronRight size={18} className="text-[var(--text-soft)]" />}
        </span>
      </button>
    );
  }

  // Mode déployé (carte ouverte) - simple et fluide
  return (
    <div 
      className={cn(
        "app-card overflow-hidden transition-all duration-250 ease-in-out",
        className
      )}
      style={{
        maxHeight: '1000px',
      }}
    >
      <div className="space-y-4">
        <div className="app-title">{title}</div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const activeIndex = options.indexOf(value);
  const thumbWidth = 100 / options.length;

  return (
    <div className="segmented-track">
      <div
        className="segmented-thumb"
        style={{
          left: `calc(${activeIndex * thumbWidth}% + ${activeIndex * 2}px)`,
          width: `calc(${thumbWidth}% - 2px)`,
        }}
      />
      {options.map((option, index) => (
        <button
          key={option}
          className={cn("segmented-option", option === value && "active")}
          onClick={() => {
            // Vibration tactile subtile pour iOS-like feedback
            if (navigator.vibrate && option !== value) {
              navigator.vibrate(3);
            }
            onChange(option);
          }}
          onMouseDown={(e) => {
            // Effet de pression subtile
            e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            // Retour à la normale
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            // Retour à la normale si on sort
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    
    // Vibration tactile subtile
    if (navigator.vibrate && Math.abs(newValue - value) >= 5) {
      navigator.vibrate(8); // Vibration légère seulement tous les 5€
    }
    
    onChange(newValue);
  };

  // Repères Apple-style
  const landmarks = [
    { value: 5, label: "5€" },
    { value: 25, label: "25€" },
    { value: 50, label: "50€" },
    { value: 75, label: "75€" },
    { value: 100, label: "100€" }
  ];

  return (
    <div className="w-full px-3">
      {/* Labels des repères au-dessus */}
      <div className="relative h-[16px] mb-2 px-1">
        {landmarks.map((landmark) => {
          const landmarkPercent = ((landmark.value - min) / (max - min)) * 100;
          const isFirst = landmark.value === min;
          const isLast = landmark.value === max;
          const transform = isFirst ? 'translateX(0%)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)';
          const alignClass = isFirst ? 'text-left' : isLast ? 'text-right' : 'text-center';
          return (
            <div
              key={landmark.value}
              className={`absolute text-[13px] font-[600] text-[var(--text-muted)] tracking-tight ${alignClass}`}
              style={{ left: `${landmarkPercent}%`, top: 0, transform }}
            >
              {landmark.label}
            </div>
          );
        })}
      </div>

      {/* Slider container Apple-style */}
      <div className="relative h-[6px] bg-[var(--surface-2)] rounded-full mb-10 mx-2">
        {/* Track active */}
        <div 
          className="absolute top-0 left-0 h-full bg-[var(--brand)] rounded-full transition-all duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
        
        {/* Repères intégrés dans le track */}
        {landmarks.map((landmark) => {
          const landmarkPercent = ((landmark.value - min) / (max - min)) * 100;
          return (
            <div
              key={`tick-${landmark.value}`}
              className="absolute top-1/2 transform -translate-y-1/2 w-[2px] h-[6px] bg-[var(--border)] rounded-full"
              style={{ left: `${landmarkPercent}%`, marginLeft: '-1px' }}
            />
          );
        })}
        
        {/* Thumb */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-[20px] h-[20px] bg-[var(--brand)] rounded-full shadow-lg transition-all duration-150 ease-out"
          style={{ 
            left: `${percent}%`, 
            marginLeft: '-10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.16)',
            border: '2px solid white'
          }}
        />
        
        {/* Input invisible */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label="amount"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
}

export function AmountDisplay({ 
  currency = "€", 
  amount, 
  frequency 
}: { 
  currency?: string; 
  amount: number;
  frequency?: "One time" | "Weekly" | "Monthly";
}) {
  const getFrequencySuffix = () => {
    if (frequency === "Weekly") return "/week";
    if (frequency === "Monthly") return "/month";
    return "";
  };

  return (
    <div className="text-center">
      <span className="align-baseline text-[28px] font-[800] tracking-[-0.5px] mr-1">{currency}</span>
      <span className="text-[40px] font-[800] tracking-[-0.5px]">{amount}</span>
      {frequency && frequency !== "One time" && (
        <span className="align-baseline text-[20px] font-[600] tracking-[-0.3px] ml-2 text-[var(--text-muted)]">
          {getFrequencySuffix()}
        </span>
      )}
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  leftIcon,
  rightAccessory,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: React.ReactNode;
}) {
  return (
    <label className="block w-full">
      <span className="block text-[var(--text-muted)] text-[16px] leading-[20px] font-[700] mb-2">
        {label}
      </span>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          autoComplete={autoComplete}
          className={cn("app-input w-full", leftIcon ? "pl-10" : "", rightAccessory ? "pr-12" : "")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {rightAccessory && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)] font-[600]">
            {rightAccessory}
          </div>
        )}
      </div>
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="checkbox-touch">
        <input
          type="checkbox"
          className="app-checkbox mt-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <label className="text-[16px] leading-[22px] text-[var(--text-muted)]">
        {label}
      </label>
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="summary-row w-full text-[16px]"
      onClick={onClick}
      aria-label={`${label} ${value}`}
    >
      <span className="text-[var(--text-muted)] font-[700] text-[16px]">{label}</span>
      <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[16px]">
        {value}
        {onClick && <ChevronRight size={18} className="text-[var(--text-soft)]" />}
      </span>
    </button>
  );
}

export function CompactSummaryRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="compact-summary-row w-full text-[15px]"
      onClick={onClick}
      aria-label={`${label} ${value}`}
    >
      <span className="text-[var(--text-muted)] font-[600] text-[15px]">{label}</span>
      <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[15px]">
        {value}
        {onClick && <ChevronRight size={16} className="text-[var(--text-soft)]" />}
      </span>
    </button>
  );
}

export function InlineNote({ 
  text, 
  amount, 
  currency = "€",
  frequency 
}: { 
  text?: string; 
  amount?: number;
  currency?: string;
  frequency?: "One time" | "Weekly" | "Monthly";
}) {
  const getTaxDeductionText = () => {
    if (amount && amount > 0) {
      const realCost = Math.round(amount * 0.34 * 100) / 100; // 34% du prix (arrondi à 2 décimales)
      const frequencySuffix = frequency === "Weekly" ? "/week" : frequency === "Monthly" ? "/month" : "";
      return `Your donation actually only costs you ${currency}${realCost}${frequencySuffix} after tax deduction.`;
    }
    return text || "";
  };

  return (
    <div className="inline-note">
      <Info size={16} className="text-[var(--text-soft)] mt-[1px] flex-shrink-0" />
      <span className="text-[13px] text-[var(--text-muted)] font-[500]">{getTaxDeductionText()}</span>
    </div>
  );
}

export function PayPalButton({ label }: { label: string }) {
  return (
    <button className="paypal-btn pressable w-full text-[16px] font-[700]">
      {label}
    </button>
  );
}

export function MosqueSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const mosquesIleDeFrance = [
    "Créteil",
    "Grande Mosquée de Paris",
    "Mosquée de Bobigny",
    "Mosquée de Saint-Denis",
    "Mosquée de Nanterre",
    "Mosquée de Argenteuil",
    "Mosquée de Montreuil",
    "Mosquée de Vitry-sur-Seine",
    "Mosquée de Champigny-sur-Marne",
    "Mosquée de Meaux",
    "Mosquée de Évry-Courcouronnes",
    "Mosquée de Corbeil-Essonnes",
    "Mosquée de Mantes-la-Jolie",
    "Mosquée de Pontoise",
    "Mosquée de Melun",
    "Mosquée de Drancy",
    "Mosquée de Aubervilliers",
    "Mosquée de La Courneuve",
    "Mosquée de Sarcelles",
    "Mosquée de Villiers-sur-Marne"
  ];

  return (
    <div className="space-y-3">
      <div className="text-[var(--text-muted)] text-[16px] leading-[20px] font-[700] mb-2">
        Choisissez votre mosquée
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {mosquesIleDeFrance.map((mosque) => (
          <button
            key={mosque}
            onClick={() => onChange(mosque)}
            className={cn(
              "w-full text-left p-3 rounded-[var(--radius-all)] border transition-all duration-150 ease-in-out",
              value === mosque
                ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)]"
                : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]/30 hover:bg-[var(--brand)]/5"
            )}
          >
            {mosque}
          </button>
        ))}
      </div>
    </div>
  );
}