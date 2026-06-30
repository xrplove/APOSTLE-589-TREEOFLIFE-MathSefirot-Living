/**
 * Traducción de los TÉRMINOS de datos (no la interfaz). Las claves son los
 * valores canónicos que usa el motor de cálculo (en español, porque coinciden
 * con los identificadores de astronomy-engine y las dignidades). Cada término
 * se traduce a inglés / hebreo / español.
 *
 * El motor nunca cambia: solo la capa de presentación elige el idioma.
 */

import type { Dignity, Planet, Sign } from "../astrology/dignities";
import type { Pillar } from "../sefirot/tree";
import type { Locale } from "./locales";

type Tri = Record<Locale, string>;

// ---- Planetas ----
export const PLANET_NAMES: Record<Planet, Tri> = {
  Sol: { en: "Sun", he: "שמש", es: "Sol" },
  Luna: { en: "Moon", he: "ירח", es: "Luna" },
  Mercurio: { en: "Mercury", he: "כוכב חמה", es: "Mercurio" },
  Venus: { en: "Venus", he: "נוגה", es: "Venus" },
  Marte: { en: "Mars", he: "מאדים", es: "Marte" },
  Júpiter: { en: "Jupiter", he: "צדק", es: "Júpiter" },
  Saturno: { en: "Saturn", he: "שבתאי", es: "Saturno" },
  Urano: { en: "Uranus", he: "אורנוס", es: "Urano" },
  Neptuno: { en: "Neptune", he: "נפטון", es: "Neptuno" },
  Plutón: { en: "Pluto", he: "פלוטו", es: "Plutón" },
};

// ---- Signos del zodíaco ----
export const SIGN_NAMES: Record<Sign, Tri> = {
  Aries: { en: "Aries", he: "טלה", es: "Aries" },
  Tauro: { en: "Taurus", he: "שור", es: "Tauro" },
  Géminis: { en: "Gemini", he: "תאומים", es: "Géminis" },
  Cáncer: { en: "Cancer", he: "סרטן", es: "Cáncer" },
  Leo: { en: "Leo", he: "אריה", es: "Leo" },
  Virgo: { en: "Virgo", he: "בתולה", es: "Virgo" },
  Libra: { en: "Libra", he: "מאזניים", es: "Libra" },
  Escorpio: { en: "Scorpio", he: "עקרב", es: "Escorpio" },
  Sagitario: { en: "Sagittarius", he: "קשת", es: "Sagitario" },
  Capricornio: { en: "Capricorn", he: "גדי", es: "Capricornio" },
  Acuario: { en: "Aquarius", he: "דלי", es: "Acuario" },
  Piscis: { en: "Pisces", he: "דגים", es: "Piscis" },
};

// ---- Dignidades planetarias ----
export const DIGNITY_NAMES: Record<Dignity, Tri> = {
  Domicilio: { en: "Domicile", he: "מָעוֹן", es: "Domicilio" },
  Exaltación: { en: "Exaltation", he: "רוֹמְמוּת", es: "Exaltación" },
  Peregrino: { en: "Peregrine", he: "נוֹדֵד", es: "Peregrino" },
  Exilio: { en: "Detriment", he: "גָּלוּת", es: "Exilio" },
  Caída: { en: "Fall", he: "נְפִילָה", es: "Caída" },
};

// ---- Sefirot: nombre + rol ----
export interface SefiraText {
  name: Tri;
  role: Tri;
}

export const SEFIRA_TEXT: Record<string, SefiraText> = {
  keter: {
    name: { en: "Keter", he: "כתר", es: "Kéter" },
    role: {
      en: "Crown · Will and essence of Being, above the body/soul distinction.",
      he: "כתר · רצון ומהות ההוויה, מעל ההבחנה בין גוף לנשמה.",
      es: "Corona · Voluntad y esencia del Ser, por encima de la distinción cuerpo/alma.",
    },
  },
  chokmah: {
    name: { en: "Chokmah", he: "חכמה", es: "Jojmá" },
    role: {
      en: "Wisdom · Seed, intuition, the soul's flash of inspiration.",
      he: "חכמה · זרע, אינטואיציה, הבזק ההשראה של הנשמה.",
      es: "Sabiduría · Semilla, intuición, destello de inspiración del alma.",
    },
  },
  binah: {
    name: { en: "Binah", he: "בינה", es: "Biná" },
    role: {
      en: "Understanding · Mental structure that gives form and limit to thought.",
      he: "בינה · מבנה מנטלי הנותן צורה וגבול למחשבה.",
      es: "Entendimiento · Estructura mental que da forma y límite al pensamiento.",
    },
  },
  chesed: {
    name: { en: "Chesed", he: "חסד", es: "Jésed" },
    role: {
      en: "Loving-kindness · The impulse to give, the soul's expansive emotional energy.",
      he: "חסד · הדחף לתת, האנרגיה הרגשית המתפשטת של הנשמה.",
      es: "Bondad · Impulso de dar, energía emocional expansiva del alma.",
    },
  },
  geburah: {
    name: { en: "Geburah", he: "גבורה", es: "Gevurá" },
    role: {
      en: "Severity · Discipline and limits: the body that restrains and sustains.",
      he: "גבורה · משמעת וגבולות: הגוף המרסן ותומך.",
      es: "Severidad · Disciplina y límites: el cuerpo que restringe y sostiene.",
    },
  },
  tiferet: {
    name: { en: "Tiferet", he: "תפארת", es: "Tiféret" },
    role: {
      en: "Beauty · Heart of the psyche; where soul and body are reconciled.",
      he: "תפארת · לב הנפש; המקום שבו הנשמה והגוף מתאחדים.",
      es: "Belleza · Corazón de la psique; donde alma y cuerpo se reconcilian.",
    },
  },
  netzach: {
    name: { en: "Netzach", he: "נצח", es: "Netsaj" },
    role: {
      en: "Victory · Willpower and persistence that pushes toward the goal.",
      he: "נצח · כוח רצון והתמדה הדוחפים אל המטרה.",
      es: "Victoria · Fuerza de voluntad y persistencia que empuja a la meta.",
    },
  },
  hod: {
    name: { en: "Hod", he: "הוד", es: "Hod" },
    role: {
      en: "Glory · Recognizing limits; adjusting structure to the material world.",
      he: "הוד · הכרה בגבולות; התאמת המבנה לעולם החומרי.",
      es: "Gloria · Reconocer límites; ajustar la estructura al mundo material.",
    },
  },
  yesod: {
    name: { en: "Yesod", he: "יסוד", es: "Yesod" },
    role: {
      en: "Foundation · Subconscious and bridge; it filters before manifesting.",
      he: "יסוד · התת-מודע והגשר; מסנן בטרם ההתגלמות.",
      es: "Fundamento · Subconsciente y puente; filtra antes de manifestar.",
    },
  },
  malkut: {
    name: { en: "Malkuth", he: "מלכות", es: "Maljut" },
    role: {
      en: "Kingdom · The manifested physical body; the psyche made matter.",
      he: "מלכות · הגוף הפיזי המתגלם; הנפש שהפכה לחומר.",
      es: "Reino · Cuerpo físico ya manifestado; la psique hecha materia.",
    },
  },
};

// ---- Pilares ----
export const PILLAR_NAMES: Record<Pillar, Tri> = {
  Alma: { en: "Soul", he: "נשמה", es: "Alma" },
  Cuerpo: { en: "Body", he: "גוף", es: "Cuerpo" },
  Psique: { en: "Psyche", he: "נפש", es: "Psique" },
};

/** Función kabalística del pilar (Expansión / Restricción / Equilibrio). */
export const PILLAR_FUNCTION: Record<Pillar, Tri> = {
  Alma: { en: "Expansion", he: "התפשטות", es: "Expansión" },
  Cuerpo: { en: "Restriction", he: "צמצום", es: "Restricción" },
  Psique: { en: "Balance", he: "איזון", es: "Equilibrio" },
};

// ---- Los 4 Mundos ----
export interface WorldText {
  translation: Tri; // nombre traducido (Emanación / Creación...)
  dimension: Tri;
}

export const WORLD_TEXT: Record<string, WorldText> = {
  atziluth: {
    translation: { en: "Emanation", he: "אצילות", es: "Emanación" },
    dimension: {
      en: "Spiritual · will",
      he: "רוחני · רצון",
      es: "Espiritual · voluntad",
    },
  },
  briah: {
    translation: { en: "Creation", he: "בריאה", es: "Creación" },
    dimension: {
      en: "Mental · intellect",
      he: "מנטלי · שכל",
      es: "Mental · intelecto",
    },
  },
  yetzirah: {
    translation: { en: "Formation", he: "יצירה", es: "Formación" },
    dimension: {
      en: "Emotional · creative",
      he: "רגשי · יצירתי",
      es: "Emocional · creativa",
    },
  },
  assiah: {
    translation: { en: "Action", he: "עשייה", es: "Acción" },
    dimension: {
      en: "Physical · material",
      he: "פיזי · חומרי",
      es: "Físico · material",
    },
  },
};

// ---- Aspectos ----
export const ASPECT_NAMES: Record<string, Tri> = {
  Conjunción: { en: "Conjunction", he: "צמידות", es: "Conjunción" },
  Sextil: { en: "Sextile", he: "שישית", es: "Sextil" },
  Cuadratura: { en: "Square", he: "ריבוע", es: "Cuadratura" },
  Trígono: { en: "Trine", he: "שילוש", es: "Trígono" },
  Oposición: { en: "Opposition", he: "ניגוד", es: "Oposición" },
};

export const HARMONY_NAMES: Record<string, Tri> = {
  fluido: { en: "flowing", he: "זורם", es: "fluido" },
  tension: { en: "tension", he: "מתח", es: "tensión" },
  neutro: { en: "neutral", he: "נייטרלי", es: "neutro" },
  conjuncion: { en: "conjunction", he: "צמידות", es: "conjunción" },
};

// ---- Números raíz (gematría / frecuencia) ----
export interface RootText {
  title: Tri;
  words: Tri;
  meaning: Tri;
}

export const ROOT_TEXT: Record<number, RootText> = {
  1: {
    title: { en: "The Leader", he: "המנהיג", es: "El Líder" },
    words: {
      en: "initiative · independence · will",
      he: "יוזמה · עצמאות · רצון",
      es: "iniciativa · independencia · voluntad",
    },
    meaning: {
      en: "Energy of beginning and self-assertion. The drive to start, lead and open a path alone.",
      he: "אנרגיה של התחלה והגדרה עצמית. הדחף ליזום, להוביל ולסלול דרך לבד.",
      es: "Energía de comienzo y autoafirmación. Empuje para iniciar, liderar y abrir camino en solitario.",
    },
  },
  2: {
    title: { en: "The Mediator", he: "המגשר", es: "El Mediador" },
    words: {
      en: "cooperation · sensitivity · balance",
      he: "שיתוף פעולה · רגישות · איזון",
      es: "cooperación · sensibilidad · equilibrio",
    },
    meaning: {
      en: "Energy of duality and relationship. Diplomacy, listening and the search for harmony between opposites.",
      he: "אנרגיה של דואליות ויחסים. דיפלומטיה, הקשבה וחיפוש הרמוניה בין ניגודים.",
      es: "Energía de la dualidad y la relación. Diplomacia, escucha y búsqueda de armonía entre opuestos.",
    },
  },
  3: {
    title: { en: "The Communicator", he: "המתקשר", es: "El Comunicador" },
    words: {
      en: "expression · creativity · joy",
      he: "ביטוי · יצירתיות · שמחה",
      es: "expresión · creatividad · alegría",
    },
    meaning: {
      en: "Expansive, social energy. A talent for creating, expressing and spreading enthusiasm.",
      he: "אנרגיה מתפשטת וחברתית. כישרון ליצור, להביע ולהדביק בהתלהבות.",
      es: "Energía expansiva y social. Talento para crear, expresar y contagiar entusiasmo.",
    },
  },
  4: {
    title: { en: "The Builder", he: "הבונה", es: "El Constructor" },
    words: {
      en: "order · stability · discipline",
      he: "סדר · יציבות · משמעת",
      es: "orden · estabilidad · disciplina",
    },
    meaning: {
      en: "Energy of structure and method. Patiently builds solid, lasting foundations.",
      he: "אנרגיה של מבנה ושיטה. בונה בסבלנות יסודות מוצקים ובני-קיימא.",
      es: "Energía de estructura y método. Construye con paciencia bases sólidas y duraderas.",
    },
  },
  5: {
    title: { en: "The Adventurer", he: "ההרפתקן", es: "El Aventurero" },
    words: {
      en: "freedom · change · versatility",
      he: "חופש · שינוי · גמישות",
      es: "libertad · cambio · versatilidad",
    },
    meaning: {
      en: "Energy of movement and experience. Curiosity, adaptability and a need for freedom.",
      he: "אנרגיה של תנועה והתנסות. סקרנות, הסתגלות וצורך בחופש.",
      es: "Energía de movimiento y experiencia. Curiosidad, adaptabilidad y necesidad de libertad.",
    },
  },
  6: {
    title: { en: "The Protector", he: "המגן", es: "El Protector" },
    words: {
      en: "love · responsibility · service",
      he: "אהבה · אחריות · שירות",
      es: "amor · responsabilidad · servicio",
    },
    meaning: {
      en: "Energy of care and harmony. Bonding, home and devotion to others.",
      he: "אנרגיה של טיפול והרמוניה. קשר, בית ומסירות לזולת.",
      es: "Energía de cuidado y armonía. Vínculo, hogar y entrega hacia los demás.",
    },
  },
  7: {
    title: { en: "The Mystic", he: "המיסטיקן", es: "El Místico" },
    words: {
      en: "introspection · analysis · wisdom",
      he: "התבוננות פנימית · ניתוח · חוכמה",
      es: "introspección · análisis · sabiduría",
    },
    meaning: {
      en: "Energy of inner search. Reflection, spirituality and deep understanding.",
      he: "אנרגיה של חיפוש פנימי. התבוננות, רוחניות והבנה עמוקה.",
      es: "Energía de búsqueda interior. Reflexión, espiritualidad y comprensión profunda.",
    },
  },
  8: {
    title: { en: "The Executive", he: "המנהל", es: "El Ejecutivo" },
    words: {
      en: "power · ambition · matter",
      he: "כוח · שאפתנות · חומר",
      es: "poder · ambición · materia",
    },
    meaning: {
      en: "Energy of material manifestation. The capacity to organize, lead and prosper.",
      he: "אנרגיה של התגשמות חומרית. היכולת לארגן, להוביל ולשגשג.",
      es: "Energía de manifestación material. Capacidad de organizar, dirigir y prosperar.",
    },
  },
  9: {
    title: { en: "The Humanitarian", he: "ההומניטרי", es: "El Humanitario" },
    words: {
      en: "compassion · idealism · closure",
      he: "חמלה · אידיאליזם · סגירה",
      es: "compasión · idealismo · cierre",
    },
    meaning: {
      en: "Energy of culmination and universal giving. Closes cycles in service of a greater good.",
      he: "אנרגיה של שיא ונתינה אוניברסלית. סוגרת מעגלים בשירות טוב גדול יותר.",
      es: "Energía de culminación y entrega universal. Cierra ciclos al servicio de un bien mayor.",
    },
  },
  11: {
    title: { en: "The Visionary (master)", he: "החוזה (מאסטר)", es: "El Visionario (maestro)" },
    words: {
      en: "intuition · inspiration · illumination",
      he: "אינטואיציה · השראה · הארה",
      es: "intuición · inspiración · iluminación",
    },
    meaning: {
      en: "The 2 raised to master: intuition and sensitivity amplified toward spiritual inspiration.",
      he: "ה-2 שהתעלה לדרגת מאסטר: אינטואיציה ורגישות מוגברות אל ההשראה הרוחנית.",
      es: "El 2 elevado a maestro: intuición y sensibilidad amplificadas hacia la inspiración espiritual.",
    },
  },
  22: {
    title: { en: "The Master Builder (master)", he: "הבונה הגדול (מאסטר)", es: "El Gran Constructor (maestro)" },
    words: {
      en: "vision · realization · legacy",
      he: "חזון · הגשמה · מורשת",
      es: "visión · realización · legado",
    },
    meaning: {
      en: "The 4 raised to master: the ability to materialize grand visions with lasting impact.",
      he: "ה-4 שהתעלה לדרגת מאסטר: היכולת להגשים חזונות גדולים בעלי השפעה מתמשכת.",
      es: "El 4 elevado a maestro: capacidad de materializar grandes visiones con impacto duradero.",
    },
  },
  33: {
    title: { en: "The Healer (master)", he: "המרפא (מאסטר)", es: "El Sanador (maestro)" },
    words: {
      en: "unconditional love · service · guidance",
      he: "אהבה ללא תנאי · שירות · הדרכה",
      es: "amor incondicional · servicio · guía",
    },
    meaning: {
      en: "The 6 raised to master: devotion and compassionate service from the highest love.",
      he: "ה-6 שהתעלה לדרגת מאסטר: מסירות ושירות רחום מתוך האהבה הנעלה ביותר.",
      es: "El 6 elevado a maestro: entrega y servicio compasivo desde el amor más elevado.",
    },
  },
};

// ---- Gematría: fuentes, métodos y glosas ----
export const GEMATRIA_SOURCE: Record<string, Tri> = {
  Nombre: { en: "Name", he: "שם", es: "Nombre" },
  Fecha: { en: "Date", he: "תאריך", es: "Fecha" },
  Síntesis: { en: "Synthesis", he: "סינתזה", es: "Síntesis" },
};

export const GEMATRIA_GLOSS: Record<Pillar, Tri> = {
  Alma: {
    en: "The name: the timeless essence of the soul. Your innate talents and how you show yourself to the world — the «how», your vehicle and your tools.",
    he: "השם: המהות הנצחית של הנשמה. כישרונותיך המולדים והאופן שבו אתה מציג את עצמך לעולם — ה«איך», כלי הרכב והכלים שלך.",
    es: "El nombre: la esencia atemporal del alma. Tus talentos innatos y la forma en que te muestras al mundo — el «cómo», tu vehículo y tus herramientas.",
  },
  Cuerpo: {
    en: "The date: the physical anchor of this incarnation. The path and lessons life sets before you — the «what», the gate to Malkuth (the Kingdom).",
    he: "התאריך: העוגן הפיזי של הגלגול הזה. הדרך והשיעורים שהחיים מציבים לפניך — ה«מה», השער למלכות.",
    es: "La fecha: el anclaje físico de esta encarnación. El camino y las lecciones que la vida te pone delante — el «qué», la puerta a Maljut (el Reino).",
  },
  Psique: {
    en: "The synthesis: how your soul drives its vehicle along the path. The central axis that reconciles essence and matter.",
    he: "הסינתזה: כיצד נשמתך מנהיגה את כלי הרכב לאורך הדרך. הציר המרכזי המאחד מהות וחומר.",
    es: "La síntesis: cómo tu alma conduce su vehículo por el camino. Eje central que reconcilia esencia y materia.",
  },
};
