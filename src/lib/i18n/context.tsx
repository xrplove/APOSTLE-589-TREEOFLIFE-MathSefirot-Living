"use client";

/**
 * Contexto de idioma. Mantiene el idioma activo, lo persiste en localStorage y
 * sincroniza los atributos `lang`/`dir` del documento (RTL para hebreo). El
 * cambio de idioma es instantáneo: no se vuelve a calcular la carta, solo se
 * re-renderiza con el diccionario correspondiente.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  isRtl,
  type Locale,
} from "./locales";
import { makeT, type Translator } from "./index";

const STORAGE_KEY = "sefirot.locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  rtl: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Recupera la preferencia guardada (solo en cliente, tras el primer render).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isLocale(saved)) {
      setLocaleState(saved);
      applyDocumentLocale(saved);
    } else {
      applyDocumentLocale(DEFAULT_LOCALE);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyDocumentLocale(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, rtl: isRtl(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Traductor memoizado por idioma activo. */
export function useT(): Translator {
  const { locale } = useLocale();
  return useMemo(() => makeT(locale), [locale]);
}
