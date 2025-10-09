import { NextResponse } from "next/server";

// Données des catégories intégrées directement pour éviter les problèmes d'import JSON sur Vercel
const categories = [
  {
    "id": "birth",
    "slug": "naissance",
    "title": "Naissance / Enfants",
    "duaas": [
      {
        "text_ar": "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
        "translit": "Rabbi hab lī min ladunka dhurriyyatan ṭayyibah innaka samī'u d-du'ā'.",
        "translation_fr": "Seigneur, accorde-moi de Ta part une descendance pure. Tu entends certes les invocations.",
        "source_type": "quran" as const,
        "source_ref": "Coran 3:38",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "illness",
    "slug": "maladie",
    "title": "Maladie / Guérison",
    "duaas": [
      {
        "text_ar": "اَللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
        "translit": "Allāhumma rabban-nās adhhibi al-ba's, ishfi wa anta ash-Shāfī, lā shifā'a illā shifā'uka, shifā'an lā yughadiru saqaman.",
        "translation_fr": "Ô Allah, Seigneur des gens, fais disparaître le mal. Guéris, Tu es le Guérisseur. Il n'est de guérison que Ta guérison, une guérison qui ne laisse aucune maladie.",
        "source_type": "hadith" as const,
        "source_ref": "Bukhari & Muslim",
        "auth_grade": "sahih" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "death",
    "slug": "deces",
    "title": "Décès / Patience",
    "duaas": [
      {
        "text_ar": "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        "translit": "Innā lillāhi wa innā ilayhi rāji'ūn.",
        "translation_fr": "Nous appartenons à Allah et c'est à Lui que nous retournons.",
        "source_type": "quran" as const,
        "source_ref": "Coran 2:156",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "marriage",
    "slug": "mariage",
    "title": "Mariage / Couple",
    "duaas": [
      {
        "text_ar": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        "translit": "Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata a'yunin wa j'alnā lil-muttaqīna imāman.",
        "translation_fr": "Seigneur, accorde-nous de la part de nos épouses et de nos descendants la fraîcheur des yeux, et fais de nous un guide pour les pieux.",
        "source_type": "quran" as const,
        "source_ref": "Coran 25:74",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "exam",
    "slug": "examen",
    "title": "Examen / Études",
    "duaas": [
      {
        "text_ar": "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        "translit": "Rabbi ishraḥ lī ṣadrī wa yassir lī amrī wa ḥlul 'uqdatan min lisānī yafqahū qawlī.",
        "translation_fr": "Seigneur, ouvre-moi ma poitrine, facilite ma tâche, et dénoue le nœud de ma langue afin qu'ils comprennent mes paroles.",
        "source_type": "quran" as const,
        "source_ref": "Coran 20:25-28",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "work",
    "slug": "travail",
    "title": "Travail / Emploi",
    "duaas": [
      {
        "text_ar": "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
        "translit": "Allāhumma innī as'aluka 'ilman nāfi'an wa rizqan ṭayyiban wa 'amalan mutaqabbalan.",
        "translation_fr": "Ô Allah, je Te demande une science utile, une subsistance pure et des œuvres acceptées.",
        "source_type": "hadith" as const,
        "source_ref": "Ibn Majah",
        "auth_grade": "sahih" as const,
        "reliability": 95
      }
    ]
  },
  {
    "id": "travel",
    "slug": "voyage",
    "title": "Voyage / Déplacement",
    "duaas": [
      {
        "text_ar": "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        "translit": "Subḥāna alladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn wa innā ilā rabbinā lamunqalibūn.",
        "translation_fr": "Gloire à Celui qui a mis ceci à notre service alors que nous n'étions pas capables de les dominer. Et c'est vers notre Seigneur que nous retournerons.",
        "source_type": "quran" as const,
        "source_ref": "Coran 43:13-14",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "anxiety",
    "slug": "anxiete",
    "title": "Anxiété / Stress",
    "duaas": [
      {
        "text_ar": "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        "translit": "Ḥasbunā Allāhu wa ni'ma al-wakīl.",
        "translation_fr": "Allah nous suffit et quel excellent protecteur!",
        "source_type": "quran" as const,
        "source_ref": "Coran 3:173",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "forgiveness",
    "slug": "pardon",
    "title": "Pardon / Repentir",
    "duaas": [
      {
        "text_ar": "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        "translit": "Rabbanā ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā lanakūnanna mina al-khāsirīn.",
        "translation_fr": "Seigneur, nous nous sommes fait du tort à nous-mêmes. Si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons certainement parmi les perdants.",
        "source_type": "quran" as const,
        "source_ref": "Coran 7:23",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "protection",
    "slug": "protection",
    "title": "Protection / Sécurité",
    "duaas": [
      {
        "text_ar": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        "translit": "Bismillāhi alladhī lā yaḍurru ma'a ismihi shay'un fī al-arḍi wa lā fī as-samā'i wa huwa as-samī'u al-'alīm.",
        "translation_fr": "Au nom d'Allah, avec Son nom rien ne peut nuire sur terre ni dans le ciel, et Il est l'Audient, l'Omniscient.",
        "source_type": "hadith" as const,
        "source_ref": "Abu Dawud & Tirmidhi",
        "auth_grade": "sahih" as const,
        "reliability": 95
      }
    ]
  },
  {
    "id": "guidance",
    "slug": "guidance",
    "title": "Guidance / Direction",
    "duaas": [
      {
        "text_ar": "اللَّهُمَّ أَلْهِمْنِي رُشْدِي وَأَعِذْنِي مِنْ شَرِّ نَفْسِي",
        "translit": "Allāhumma alhimnī rushdī wa a'idhnī min sharri nafsī.",
        "translation_fr": "Ô Allah, inspire-moi ma droiture et protège-moi du mal de mon âme.",
        "source_type": "hadith" as const,
        "source_ref": "Tirmidhi",
        "auth_grade": "hasan" as const,
        "reliability": 85
      }
    ]
  },
  {
    "id": "parents",
    "slug": "parents",
    "title": "Parents / Famille",
    "duaas": [
      {
        "text_ar": "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        "translit": "Rabbi irḥamhumā kamā rabbayānī ṣaghīran.",
        "translation_fr": "Seigneur, fais-leur miséricorde comme ils m'ont élevé quand j'étais petit.",
        "source_type": "quran" as const,
        "source_ref": "Coran 17:24",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "gratitude",
    "slug": "gratitude",
    "title": "Gratitude / Remerciement",
    "duaas": [
      {
        "text_ar": "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ",
        "translit": "Rabbi awzi'nī an ashkura ni'mataka allatī an'amta 'alayya wa 'alā wālidayya wa an a'mala ṣāliḥan tarḍāhu.",
        "translation_fr": "Seigneur, inspire-moi pour que je Te remercie pour Tes bienfaits dont Tu m'as comblé ainsi que mes parents, et pour que j'accomplisse de bonnes œuvres que Tu agrées.",
        "source_type": "quran" as const,
        "source_ref": "Coran 27:19",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  },
  {
    "id": "other",
    "slug": "autre",
    "title": "Autre",
    "duaas": [
      {
        "text_ar": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        "translit": "Rabbanā ātinā fī ad-dunyā ḥasanatan wa fī al-ākhirati ḥasanatan wa qinā 'adhāba an-nār.",
        "translation_fr": "Seigneur, accorde-nous un bien dans ce monde et un bien dans l'au-delà, et protège-nous du châtiment du Feu.",
        "source_type": "quran" as const,
        "source_ref": "Coran 2:201",
        "auth_grade": "quran" as const,
        "reliability": 100
      }
    ]
  }
];

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error in categories API:", error);
    return NextResponse.json([], { status: 500 });
  }
}