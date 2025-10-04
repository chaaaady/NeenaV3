export type SourceType = "quran" | "hadith";
export type AuthGrade = "sahih" | "hasan" | "quran";

export type Duaa = {
  text_ar: string;
  translit: string;
  translation_fr: string;
  source_type: SourceType;
  source_ref: string;
  auth_grade: AuthGrade;
  reliability: number;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  duaas: Duaa[];
};

export type Request = {
  id: string;
  author: string;
  context_text: string;
  category_id: string;
  created_at: string;
  counters: {
    duaa_done: number;
  };
};

