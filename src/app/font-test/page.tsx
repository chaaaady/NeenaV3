"use client";

import { useState } from "react";

const fonts = [
  // American Grotesk
  { name: "American Grotesk Black", file: "TestAmericanGrotesk-Black.otf", family: "American Grotesk Black", weight: 900 },
  { name: "American Grotesk Bold", file: "TestAmericanGrotesk-Bold.otf", family: "American Grotesk Bold", weight: 700 },
  { name: "American Grotesk Medium", file: "TestAmericanGrotesk-Medium.otf", family: "American Grotesk Medium", weight: 500 },
  
  // Calibre
  { name: "Calibre Black", file: "TestCalibre-Black.otf", family: "Calibre Black", weight: 900 },
  { name: "Calibre Bold", file: "TestCalibre-Bold.otf", family: "Calibre Bold", weight: 700 },
  { name: "Calibre Medium", file: "TestCalibre-Medium.otf", family: "Calibre Medium", weight: 500 },
  
  // Founders Grotesk
  { name: "Founders Grotesk Bold", file: "TestFoundersGrotesk-Bold.otf", family: "Founders Grotesk Bold", weight: 700 },
  { name: "Founders Grotesk Medium", file: "TestFoundersGrotesk-Medium.otf", family: "Founders Grotesk Medium", weight: 500 },
  { name: "Founders Grotesk Mono Bold", file: "TestFoundersGroteskMono-Bold.otf", family: "Founders Grotesk Mono Bold", weight: 700 },
  { name: "Founders Grotesk Mono Medium", file: "TestFoundersGroteskMono-Medium.otf", family: "Founders Grotesk Mono Medium", weight: 500 },
  { name: "Founders Grotesk Text Bold", file: "TestFoundersGroteskText-Bold.otf", family: "Founders Grotesk Text Bold", weight: 700 },
  { name: "Founders Grotesk Text Medium", file: "TestFoundersGroteskText-Medium.otf", family: "Founders Grotesk Text Medium", weight: 500 },
  
  // National 2
  { name: "National 2 Black", file: "TestNational2-Black.otf", family: "National 2 Black", weight: 900 },
  { name: "National 2 Bold", file: "TestNational2-Bold.otf", family: "National 2 Bold", weight: 700 },
  { name: "National 2 Medium", file: "TestNational2-Medium.otf", family: "National 2 Medium", weight: 500 },
  { name: "National 2 Condensed Black", file: "TestNational2Condensed-Black.otf", family: "National 2 Condensed Black", weight: 900 },
  { name: "National 2 Condensed Bold", file: "TestNational2Condensed-Bold.otf", family: "National 2 Condensed Bold", weight: 700 },
  { name: "National 2 Condensed Medium", file: "TestNational2Condensed-Medium.otf", family: "National 2 Condensed Medium", weight: 500 },
  
  // Söhne
  { name: "Söhne Breit Fett", file: "TestSöhneBreit-Fett.otf", family: "Söhne Breit Fett", weight: 700 },
  { name: "Söhne Breit Halbfett", file: "TestSöhneBreit-Halbfett.otf", family: "Söhne Breit Halbfett", weight: 600 },
  { name: "Söhne Mono Fett", file: "TestSöhneMono-Fett.otf", family: "Söhne Mono Fett", weight: 700 },
  { name: "Söhne Mono Halbfett", file: "TestSöhneMono-Halbfett.otf", family: "Söhne Mono Halbfett", weight: 600 },
  { name: "Söhne Schmal Fett", file: "TestSöhneSchmal-Fett.otf", family: "Söhne Schmal Fett", weight: 700 },
  { name: "Söhne Schmal Halbfett", file: "TestSöhneSchmal-Halbfett.otf", family: "Söhne Schmal Halbfett", weight: 600 },
  
  // Metric
  { name: "Metric Black", file: "TestMetric-Black.otf", family: "Metric Black", weight: 900 },
  { name: "Metric Bold", file: "TestMetric-Bold.otf", family: "Metric Bold", weight: 700 },
  { name: "Metric Semibold", file: "TestMetric-Semibold.otf", family: "Metric Semibold", weight: 600 },
  
  // Untitled Sans
  { name: "Untitled Sans Black", file: "TestUntitledSans-Black.otf", family: "Untitled Sans Black", weight: 900 },
  { name: "Untitled Sans Bold", file: "TestUntitledSans-Bold.otf", family: "Untitled Sans Bold", weight: 700 },
  { name: "Untitled Sans Medium", file: "TestUntitledSans-Medium.otf", family: "Untitled Sans Medium", weight: 500 },
];

export default function FontTestPage() {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <style jsx global>{`
        ${fonts.map(font => `
          @font-face {
            font-family: '${font.family}';
            src: url('/fonts/test/${font.file}') format('opentype');
            font-weight: ${font.weight};
            font-style: normal;
            font-display: swap;
          }
        `).join('\n')}
      `}</style>

      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} transition-colors duration-300`}>
        {/* Header */}
        <div className={`sticky top-0 z-50 ${darkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Neena — Font Test Lab
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {fonts.length} polices Klim Type Foundry
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-all`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Selected Font Preview */}
          {selectedFont && (
            <div className={`mb-12 p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Preview: {selectedFont}
                </h2>
                <button
                  onClick={() => setSelectedFont(null)}
                  className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} transition-all`}
                >
                  ✕ Fermer
                </button>
              </div>
              
              {/* Lowercase */}
              <div className="mb-8">
                <div className={`text-xs uppercase tracking-wider mb-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  Minuscules
                </div>
                <div 
                  className={`text-[80px] font-black leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  Neena
                </div>
                <div 
                  className={`mt-4 text-[40px] font-black ${darkMode ? 'text-white/60' : 'text-gray-500'}`}
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  Mosquée • Sadaqah • Zakat
                </div>
              </div>

              {/* Uppercase */}
              <div>
                <div className={`text-xs uppercase tracking-wider mb-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  Majuscules
                </div>
                <div 
                  className={`text-[80px] font-black leading-none uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  Neena
                </div>
                <div 
                  className={`mt-4 text-[40px] font-black uppercase ${darkMode ? 'text-white/60' : 'text-gray-500'}`}
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  Mosquée • Sadaqah • Zakat
                </div>
              </div>
            </div>
          )}

          {/* Font Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => setSelectedFont(font.family)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 text-left ${
                  selectedFont === font.family
                    ? darkMode 
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 shadow-xl' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-400 shadow-xl'
                    : darkMode
                      ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/30 hover:shadow-xl'
                      : 'bg-white border border-gray-200 hover:border-gray-400 hover:shadow-xl'
                }`}
              >
                {/* Font Name Label */}
                <div className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {font.name}
                </div>
                
                {/* Neena Preview - Lowercase */}
                <div 
                  className={`text-[28px] font-black leading-none mb-1 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } ${selectedFont === font.family ? 'scale-105' : 'group-hover:scale-105'}`}
                  style={{ 
                    fontFamily: `'${font.family}', sans-serif`,
                    fontWeight: font.weight 
                  }}
                >
                  Neena
                </div>
                
                {/* Neena Preview - Uppercase */}
                <div 
                  className={`text-[28px] font-black leading-none mb-2 uppercase transition-colors ${
                    darkMode ? 'text-white/70' : 'text-gray-700'
                  } ${selectedFont === font.family ? 'scale-105' : 'group-hover:scale-105'}`}
                  style={{ 
                    fontFamily: `'${font.family}', sans-serif`,
                    fontWeight: font.weight 
                  }}
                >
                  Neena
                </div>
                
                {/* Secondary Text */}
                <div 
                  className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}
                  style={{ 
                    fontFamily: `'${font.family}', sans-serif`,
                    fontWeight: font.weight 
                  }}
                >
                  Mosquée de Créteil
                </div>

                {/* Selection Indicator */}
                {selectedFont === font.family && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Info Footer */}
          <div className={`mt-12 p-6 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              💡 <strong>Astuce:</strong> Cliquez sur une police pour voir un aperçu en grand format. 
              Toutes les polices sont issues de la collection Klim Type Foundry.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

