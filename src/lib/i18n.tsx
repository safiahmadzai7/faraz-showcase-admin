import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "dr";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.jobs": "Find a Job",
  "nav.scholarships": "Scholarships",
  "nav.companies": "Companies",
  "nav.blog": "Blog",
  "lang.toggle": "دری",

  "hero.tag": "Empowering Afghan Talents",
  "hero.title.1": "Building Bridges to a",
  "hero.title.2": "Brighter Future",
  "hero.subtitle":
    "Project Faraz stands with Afghan students and professionals — connecting talent with jobs, scholarships, and opportunities that shape tomorrow.",
  "hero.search.q": "Job title, keyword or company",
  "hero.search.loc": "City, country or remote",
  "hero.search.btn": "Search",

  "mission.tag": "Our Mission",
  "mission.title": "Talent has no borders — opportunity shouldn't either.",
  "mission.body":
    "We believe every Afghan deserves the chance to grow, learn, and lead. Faraz was built to open doors — to global scholarships, meaningful careers, and a future written by your own hand.",

  "how.tag": "How It Works",
  "how.title": "Three simple steps to your next opportunity",
  "how.s1.title": "1. Choose",
  "how.s1.body": "Browse curated jobs and scholarships hand-picked for Afghan talents.",
  "how.s2.title": "2. Review",
  "how.s2.body": "Read the full requirements, eligibility and how-to-apply details.",
  "how.s3.title": "3. Apply",
  "how.s3.body": "Follow the steps to submit — or let us apply for you, free of charge.",

  "help.tag": "We're here for you",
  "help.title": "Can't apply on your own? We'll do it for you — free.",
  "help.body":
    "If you're facing any difficulty with a scholarship or job application, our team will apply on your behalf at no cost. Reach out by phone or email — we'll walk with you every step of the way.",
  "help.call": "Call us",
  "help.email": "Email us",
};

const dr: Dict = {
  "nav.home": "خانه",
  "nav.jobs": "کاریابی",
  "nav.scholarships": "بورسیه‌ها",
  "nav.companies": "شرکت‌ها",
  "nav.blog": "وبلاگ",
  "lang.toggle": "English",

  "hero.tag": "توانمندسازی استعدادهای افغان",
  "hero.title.1": "پلی به سوی",
  "hero.title.2": "آینده‌ای روشن",
  "hero.subtitle":
    "پروژه فراز در کنار دانشجویان و متخصصان افغان ایستاده است — استعدادها را با کار، بورسیه و فرصت‌هایی که فردا را می‌سازند پیوند می‌دهد.",
  "hero.search.q": "عنوان شغل، کلمه کلیدی یا شرکت",
  "hero.search.loc": "شهر، کشور یا دورکاری",
  "hero.search.btn": "جستجو",

  "mission.tag": "ماموریت ما",
  "mission.title": "استعداد مرز نمی‌شناسد — فرصت نیز نباید بشناسد.",
  "mission.body":
    "ما باور داریم هر افغان شایستهٔ رشد، آموختن و رهبری است. فراز ساخته شد تا درها را بگشاید — به روی بورسیه‌های جهانی، مشاغل ارزشمند و آینده‌ای که با دست خودت می‌نویسی.",

  "how.tag": "چگونه کار می‌کند",
  "how.title": "سه گام ساده تا فرصت بعدی شما",
  "how.s1.title": "۱. انتخاب کنید",
  "how.s1.body": "میان کارها و بورسیه‌های گزینش‌شدهٔ ویژهٔ افغان‌ها جستجو کنید.",
  "how.s2.title": "۲. بررسی کنید",
  "how.s2.body": "شرایط، معیارها و روش درخواست را با دقت بخوانید.",
  "how.s3.title": "۳. درخواست دهید",
  "how.s3.body": "مراحل را دنبال کنید — یا اجازه دهید ما به‌جای شما رایگان درخواست دهیم.",

  "help.tag": "ما در کنار شما هستیم",
  "help.title": "نمی‌توانید خودتان درخواست دهید؟ ما رایگان انجام می‌دهیم.",
  "help.body":
    "اگر در روند درخواست بورسیه یا کار با مشکل مواجه هستید، تیم ما به‌صورت رایگان به‌جای شما درخواست می‌دهد. از طریق تماس تلفنی یا ایمیل با ما در ارتباط باشید — در هر گام همراه شما هستیم.",
  "help.call": "تماس بگیرید",
  "help.email": "ایمیل",
};

const DICTS: Record<Lang, Dict> = { en, dr };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof en) => string; dir: "ltr" | "rtl" };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("faraz-lang") as Lang | null)) || null;
    if (saved === "en" || saved === "dr") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "dr" ? "fa-AF" : "en";
      document.documentElement.dir = lang === "dr" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("faraz-lang", l);
  };

  const t = (key: keyof typeof en) => DICTS[lang][key] ?? en[key] ?? String(key);
  const dir = lang === "dr" ? "rtl" : "ltr";

  return <LangCtx.Provider value={{ lang, setLang, t, dir }}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangCtx);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => (en as Dict)[k] ?? k, dir: "ltr" as const };
  return ctx;
}
