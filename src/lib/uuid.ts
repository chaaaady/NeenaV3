/**
 * Génération d'UUID compatible tous environnements (navigateur + Node.js)
 * Utilise crypto.randomUUID() si disponible, sinon un fallback
 */

export function generateUUID(): string {
  // Node.js 15+ et navigateurs modernes
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback pour les environnements plus anciens
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Fonction de hashing compatible
 * Utilise crypto.subtle (Web Crypto API) si disponible, sinon fallback simple
 */
export async function hashString(str: string): Promise<string> {
  // Essayer crypto.subtle d'abord (Web Crypto API)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_e) {
      // Fallback si l'API échoue
    }
  }
  
  // Fallback : hash simple basé sur le contenu (moins sécurisé mais fonctionnel)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convertir en hex et ajouter un timestamp pour plus d'unicité
  return Math.abs(hash).toString(16).padStart(8, '0') + Date.now().toString(16);
}

