/**
 * Datos de dignidades planetarias y triplicidades.
 * Portado del sistema CalculadoraAstral original.
 */

export const SIGNS = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
] as const;

export type Sign = (typeof SIGNS)[number];

export const PLANETS = [
  "Sol", "Luna", "Mercurio", "Venus", "Marte",
  "Júpiter", "Saturno", "Urano", "Neptuno", "Plutón",
] as const;

export type Planet = (typeof PLANETS)[number];

export type Dignity = "Domicilio" | "Exaltación" | "Peregrino" | "Exilio" | "Caída";

/** Intensidad de expresión (0-100) según la dignidad del planeta. */
export const INTENSIDADES: Record<Dignity, number> = {
  Domicilio: 100,
  Exaltación: 90,
  Peregrino: 50,
  Exilio: 30,
  Caída: 10,
};

/** Triplicidades (mismo elemento) usadas para los decanatos. */
export const TRIPLICIDADES: Record<Sign, [Sign, Sign, Sign]> = {
  Aries: ["Aries", "Leo", "Sagitario"],
  Tauro: ["Tauro", "Virgo", "Capricornio"],
  Géminis: ["Géminis", "Libra", "Acuario"],
  Cáncer: ["Cáncer", "Escorpio", "Piscis"],
  Leo: ["Leo", "Sagitario", "Aries"],
  Virgo: ["Virgo", "Capricornio", "Tauro"],
  Libra: ["Libra", "Acuario", "Géminis"],
  Escorpio: ["Escorpio", "Piscis", "Cáncer"],
  Sagitario: ["Sagitario", "Aries", "Leo"],
  Capricornio: ["Capricornio", "Tauro", "Virgo"],
  Acuario: ["Acuario", "Géminis", "Libra"],
  Piscis: ["Piscis", "Cáncer", "Escorpio"],
};

export interface AstroDato {
  desc: string;
  dignidad: Dignity;
}

export const DATOS_ASTROS: Record<Planet, Record<Sign, AstroDato>> = {
  Sol: {
    Aries: { desc: "Pionera, valiente e impulsiva.", dignidad: "Exaltación" },
    Tauro: { desc: "Paciente, estable y terca.", dignidad: "Peregrino" },
    Géminis: { desc: "Curiosa, adaptable y habladora.", dignidad: "Peregrino" },
    Cáncer: { desc: "Sensible, protectora y familiar.", dignidad: "Peregrino" },
    Leo: { desc: "Carismática, orgullosa y creativa.", dignidad: "Domicilio" },
    Virgo: { desc: "Analítica, perfeccionista y servicial.", dignidad: "Peregrino" },
    Libra: { desc: "Sociable, diplomática e indecisa.", dignidad: "Caída" },
    Escorpio: { desc: "Intensa, magnética y desconfiada.", dignidad: "Peregrino" },
    Sagitario: { desc: "Optimista, sincera y aventurera.", dignidad: "Peregrino" },
    Capricornio: { desc: "Disciplinada, ambiciosa y reservada.", dignidad: "Peregrino" },
    Acuario: { desc: "Original, independiente y rebelde.", dignidad: "Exilio" },
    Piscis: { desc: "Soñadora, compasiva e intuitiva.", dignidad: "Peregrino" },
  },
  Luna: {
    Aries: { desc: "De reacciones rápidas y explosiva.", dignidad: "Peregrino" },
    Tauro: { desc: "Emocionalmente estable y pacífica.", dignidad: "Exaltación" },
    Géminis: { desc: "Racionalizadora de sus sentimientos.", dignidad: "Peregrino" },
    Cáncer: { desc: "Muy maternal, empática y nostálgica.", dignidad: "Domicilio" },
    Leo: { desc: "Expresiva, dramática y cálida.", dignidad: "Peregrino" },
    Virgo: { desc: "Práctica al consolar, busca el orden.", dignidad: "Peregrino" },
    Libra: { desc: "Evasiva del conflicto, busca compañía.", dignidad: "Peregrino" },
    Escorpio: { desc: "De emociones extremas, reservada.", dignidad: "Caída" },
    Sagitario: { desc: "Necesitada de espacio y libertad.", dignidad: "Peregrino" },
    Capricornio: { desc: "Fría en apariencia, reprime el llanto.", dignidad: "Exilio" },
    Acuario: { desc: "Desapegada y emocionalmente distante.", dignidad: "Peregrino" },
    Piscis: { desc: "Hipersensible, absorbe emociones.", dignidad: "Peregrino" },
  },
  Mercurio: {
    Aries: { desc: "Directa, rápida y argumentativa.", dignidad: "Peregrino" },
    Tauro: { desc: "De pensamiento lento y pragmático.", dignidad: "Peregrino" },
    Géminis: { desc: "Brillante, curiosa y dispersa.", dignidad: "Domicilio" },
    Cáncer: { desc: "Subjetiva, se comunica con emoción.", dignidad: "Peregrino" },
    Leo: { desc: "Teatral, persuasiva y de voz fuerte.", dignidad: "Peregrino" },
    Virgo: { desc: "Lógica, crítica y muy detallista.", dignidad: "Exaltación" },
    Libra: { desc: "Conciliadora, táctica y diplomática.", dignidad: "Peregrino" },
    Escorpio: { desc: "Investigadora, incisiva e intuitiva.", dignidad: "Peregrino" },
    Sagitario: { desc: "Filosófica, visionaria y sin tacto.", dignidad: "Exilio" },
    Capricornio: { desc: "Metódica, seria y enfocada.", dignidad: "Peregrino" },
    Acuario: { desc: "Inventiva, vanguardista y abierta.", dignidad: "Peregrino" },
    Piscis: { desc: "Poética, imaginativa y despistada.", dignidad: "Caída" },
  },
  Venus: {
    Aries: { desc: "Apasionada, conquistadora y lanzada.", dignidad: "Exilio" },
    Tauro: { desc: "Sensual, leal, posesiva y material.", dignidad: "Domicilio" },
    Géminis: { desc: "Coqueta, intelectual y juguetona.", dignidad: "Peregrino" },
    Cáncer: { desc: "Tierna, apegada y busca un hogar.", dignidad: "Peregrino" },
    Leo: { desc: "Generosa, demostrativa y celosa.", dignidad: "Peregrino" },
    Virgo: { desc: "Cautelosa, analítica en el romance.", dignidad: "Caída" },
    Libra: { desc: "Romántica, detallista y armónica.", dignidad: "Domicilio" },
    Escorpio: { desc: "Magnética, celosa y muy profunda.", dignidad: "Exilio" },
    Sagitario: { desc: "Independiente, busca aventuras.", dignidad: "Peregrino" },
    Capricornio: { desc: "Seria, busca estatus y estabilidad.", dignidad: "Peregrino" },
    Acuario: { desc: "Amistosa, poco convencional, libre.", dignidad: "Peregrino" },
    Piscis: { desc: "Incondicional, idealista y sacrificada.", dignidad: "Exaltación" },
  },
  Marte: {
    Aries: { desc: "Competitiva, agresiva y rápida.", dignidad: "Domicilio" },
    Tauro: { desc: "Implacable, lenta pero con aguante.", dignidad: "Exilio" },
    Géminis: { desc: "Inquieta, discute y gasta energía.", dignidad: "Peregrino" },
    Cáncer: { desc: "Pasivo-agresiva, defiende lo suyo.", dignidad: "Caída" },
    Leo: { desc: "Orgullosa, dramática y determinada.", dignidad: "Peregrino" },
    Virgo: { desc: "Trabajadora, metódica y técnica.", dignidad: "Peregrino" },
    Libra: { desc: "Evasiva al conflicto, defensora justa.", dignidad: "Exilio" },
    Escorpio: { desc: "Estratégica, rencorosa y extrema.", dignidad: "Domicilio" },
    Sagitario: { desc: "Entusiasta, dispersa e impaciente.", dignidad: "Peregrino" },
    Capricornio: { desc: "Eficaz, fría, calculadora y tenaz.", dignidad: "Exaltación" },
    Acuario: { desc: "Rebelde, lucha por causas e ideales.", dignidad: "Peregrino" },
    Piscis: { desc: "Pacífica, le cuesta afirmarse, huye.", dignidad: "Peregrino" },
  },
  Júpiter: {
    Aries: { desc: "Emprendedora, inspiradora líder.", dignidad: "Peregrino" },
    Tauro: { desc: "Próspera, enfocada en la comodidad.", dignidad: "Peregrino" },
    Géminis: { desc: "Curiosa de más, suerte por contactos.", dignidad: "Exilio" },
    Cáncer: { desc: "Protectora de su tribu, intuitiva.", dignidad: "Exaltación" },
    Leo: { desc: "Teatral, magnánima y muy generosa.", dignidad: "Peregrino" },
    Virgo: { desc: "Escéptica, ética y muy servicial.", dignidad: "Exilio" },
    Libra: { desc: "Justa, atrae suerte en asociaciones.", dignidad: "Peregrino" },
    Escorpio: { desc: "Investiga misterios, se transforma.", dignidad: "Peregrino" },
    Sagitario: { desc: "Viajera, filósofa y muy afortunada.", dignidad: "Domicilio" },
    Capricornio: { desc: "Ortodoxa, estructurada y seria.", dignidad: "Caída" },
    Acuario: { desc: "Tolerante, humanitaria y reformista.", dignidad: "Peregrino" },
    Piscis: { desc: "Mística, compasiva y muy espiritual.", dignidad: "Domicilio" },
  },
  Saturno: {
    Aries: { desc: "Temerosa de liderar o dictatorial.", dignidad: "Caída" },
    Tauro: { desc: "Ahorradora por miedo a carecer.", dignidad: "Peregrino" },
    Géminis: { desc: "Insegura al hablar, intelectual.", dignidad: "Peregrino" },
    Cáncer: { desc: "Reprimida emocionalmente.", dignidad: "Exilio" },
    Leo: { desc: "Autoexigente, teme hacer el ridículo.", dignidad: "Exilio" },
    Virgo: { desc: "Hipercrítica, obsesiva del control.", dignidad: "Peregrino" },
    Libra: { desc: "Exige contratos, teme la injusticia.", dignidad: "Exaltación" },
    Escorpio: { desc: "Controladora, teme la traición.", dignidad: "Peregrino" },
    Sagitario: { desc: "Rígida en sus creencias morales.", dignidad: "Peregrino" },
    Capricornio: { desc: "Autoritaria, ambiciosa, cumplida.", dignidad: "Domicilio" },
    Acuario: { desc: "Estructurada dentro de su rebeldía.", dignidad: "Domicilio" },
    Piscis: { desc: "Abnegada, con culpas inconscientes.", dignidad: "Peregrino" },
  },
  Urano: {
    Aries: { desc: "Innovadora, rompe esquemas rápido.", dignidad: "Peregrino" },
    Tauro: { desc: "Desestabiliza la economía y el confort.", dignidad: "Caída" },
    Géminis: { desc: "Mente eléctrica, ideas revolucionarias.", dignidad: "Peregrino" },
    Cáncer: { desc: "Rompe tradiciones familiares.", dignidad: "Peregrino" },
    Leo: { desc: "Creatividad rebelde y excéntrica.", dignidad: "Exilio" },
    Virgo: { desc: "Inventora de sistemas tecnológicos.", dignidad: "Peregrino" },
    Libra: { desc: "Revoluciona el concepto de pareja.", dignidad: "Peregrino" },
    Escorpio: { desc: "Transformación brusca de tabúes.", dignidad: "Exaltación" },
    Sagitario: { desc: "Filosofía libre y científica.", dignidad: "Peregrino" },
    Capricornio: { desc: "Derrumba estructuras antiguas.", dignidad: "Peregrino" },
    Acuario: { desc: "Genialidad, humanitarismo extremo.", dignidad: "Domicilio" },
    Piscis: { desc: "Espiritualidad vanguardista.", dignidad: "Peregrino" },
  },
  Neptuno: {
    Aries: { desc: "Idealismo impulsivo y soñador.", dignidad: "Peregrino" },
    Tauro: { desc: "Materializa sueños o dinero ilusorio.", dignidad: "Peregrino" },
    Géminis: { desc: "Imaginación desbordante, mentiras.", dignidad: "Peregrino" },
    Cáncer: { desc: "Misticismo hogareño, hipersensibilidad.", dignidad: "Exaltación" },
    Leo: { desc: "Cine, arte dramático y glamour.", dignidad: "Peregrino" },
    Virgo: { desc: "Caos en el orden, hipocondría.", dignidad: "Exilio" },
    Libra: { desc: "Amor idílico, evita confrontar.", dignidad: "Peregrino" },
    Escorpio: { desc: "Interés en ocultismo y misterios.", dignidad: "Peregrino" },
    Sagitario: { desc: "Búsqueda espiritual sin fronteras.", dignidad: "Peregrino" },
    Capricornio: { desc: "Fantasías corporativas, fraudes.", dignidad: "Caída" },
    Acuario: { desc: "Utopías sociales y solidaridad.", dignidad: "Peregrino" },
    Piscis: { desc: "Conexión mística total, evasión.", dignidad: "Domicilio" },
  },
  Plutón: {
    Aries: { desc: "Poder a través de la fuerza y acción.", dignidad: "Exaltación" },
    Tauro: { desc: "Obsesión por el control de recursos.", dignidad: "Exilio" },
    Géminis: { desc: "Poder de persuasión mental oscura.", dignidad: "Peregrino" },
    Cáncer: { desc: "Transformación desde la raíz familiar.", dignidad: "Peregrino" },
    Leo: { desc: "Hambre de poder y control absoluto.", dignidad: "Peregrino" },
    Virgo: { desc: "Destrucción y mejora del trabajo/salud.", dignidad: "Peregrino" },
    Libra: { desc: "Crisis y renacimiento en las relaciones.", dignidad: "Peregrino" },
    Escorpio: { desc: "Regeneración, intensidad sexual y tabú.", dignidad: "Domicilio" },
    Sagitario: { desc: "Fanatismo o destrucción de dogmas.", dignidad: "Peregrino" },
    Capricornio: { desc: "Destrucción de gobiernos y status quo.", dignidad: "Peregrino" },
    Acuario: { desc: "Poder de las masas y tecnología.", dignidad: "Caída" },
    Piscis: { desc: "Transformación del inconsciente global.", dignidad: "Peregrino" },
  },
};
