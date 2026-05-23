import { useNavigate } from "react-router-dom";
import { User, Bell, Smartphone, HelpCircle, ChevronLeft, ChevronRight, Globe, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation, LanguageType, CurrencyType } from "@/context/LanguageContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, currency, setCurrency, t } = useTranslation();

  const settingItems = [
    { icon: User, label: t("settings.editProfile"), desc: "Change your personal details", action: () => navigate("/settings/edit-profile") },
    { icon: Bell, label: t("settings.notifications"), desc: "Manage alerts and updates", action: () => navigate("/settings/notifications") },
    { icon: Smartphone, label: t("settings.permissions"), desc: "Location and camera access", action: () => navigate("/settings/permissions") },
    { icon: HelpCircle, label: t("settings.help"), desc: "Get help and find answers", action: () => {} },
  ];

  const languagesList: { code: LanguageType; name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "es", name: "Español (Spanish)" },
    { code: "ar", name: "العربية (Arabic)" },
  ];

  const currenciesList: { code: CurrencyType; label: string; symbol: string }[] = [
    { code: "INR", label: "Indian Rupee", symbol: "₹" },
    { code: "USD", label: "US Dollar", symbol: "$" },
    { code: "EUR", label: "Euro", symbol: "€" },
    { code: "GBP", label: "British Pound", symbol: "£" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-2 border-b border-border/10">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="font-display text-lg font-bold">{t("settings.header")}</h1>
      </div>

      <div className="mx-4 mt-6 space-y-5">
        {/* Language & Currency Preferences Card */}
        <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("settings.preferences")}
          </h3>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Globe size={14} className="text-accent" />
              {t("settings.lang")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`rounded-xl py-2 px-3 text-xs font-medium border text-center transition-all ${
                    language === lang.code
                      ? "border-accent bg-accent/10 text-accent font-bold"
                      : "border-border/40 bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2 border-t border-border/10 pt-4">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Coins size={14} className="text-accent" />
              {t("settings.currency")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currenciesList.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr.code)}
                  className={`rounded-xl py-2 px-3 text-xs font-medium border text-center transition-all ${
                    currency === curr.code
                      ? "border-accent bg-accent/10 text-accent font-bold"
                      : "border-border/40 bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {curr.symbol} {curr.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Settings List */}
        <div className="space-y-2.5">
          <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
            General
          </h3>
          {settingItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={item.action}
              className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-card p-4 text-left shadow-sm hover:bg-muted/40 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <item.icon size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-card-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
