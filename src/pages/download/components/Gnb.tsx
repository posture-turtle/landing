import { useCallback, useEffect, useState } from "react";

import { ModeToggle } from "@gbgr/ui";
import type { ModeToggleValue } from "@gbgr/ui";
import { useTranslation } from "react-i18next";

import { assets } from "../assets";
import { responsive } from "../responsive";
import DarkLogoEn from "../../../assets/logo-dark-en.svg";
import DarkLogoKo from "../../../assets/logo-dark-ko.svg";
import LightLogoEn from "../../../assets/logo-light-en.svg";
import LightLogoKo from "../../../assets/logo-light-ko.svg";

type GnbProps = {
  modeValue: ModeToggleValue;
  onModeValueChange: (value: ModeToggleValue) => void;
  modeAriaLabel?: string;
};

function LangToggle() {
  const { i18n } = useTranslation();
  const isKo = i18n.language === "ko";

  const toggleLang = useCallback(() => {
    i18n.changeLanguage(isKo ? "en" : "ko");
  }, [i18n, isKo]);

  return (
    <button
      className="rounded-full border border-[#e3e1df] px-2.5 py-1 text-[12px] font-semibold text-[#7e7e7b] hover:bg-[#f9f8f7] cursor-pointer"
      onClick={toggleLang}
      type="button"
    >
      {isKo ? "EN" : "KO"}
    </button>
  );
}

function BrandLogo({ modeValue }: { modeValue: ModeToggleValue }) {
  const { i18n } = useTranslation();
  const isKo = i18n.language.startsWith("ko");
  const logoSrc =
    modeValue === "dark"
      ? isKo
        ? DarkLogoKo
        : DarkLogoEn
      : isKo
        ? LightLogoKo
        : LightLogoEn;

  return (
    <img
      alt={isKo ? "거부기린" : "Posture Turtle"}
      className="h-6 w-auto"
      src={logoSrc}
    />
  );
}

export function Gnb({ modeValue, onModeValueChange, modeAriaLabel }: GnbProps) {
  const { t } = useTranslation();
  const navItems = [
    { label: t("gnb.download"), key: "download" },
    { label: t("gnb.update"), key: "update" },
    { label: t("gnb.pricing"), key: "pricing" },
    { label: t("gnb.blog"), key: "blog" },
  ] as const;

  const navLinks: Record<string, { href: string; external?: boolean }> = {
    blog: { href: "https://blog.postureturtle.com/", external: true },
  };

  const trialHref = "https://demo.postureturtle.com/";
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerVisible(true);
    requestAnimationFrame(() => setIsDrawerOpen(true));
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    window.setTimeout(() => setIsDrawerVisible(false), 320);
  }, []);

  useEffect(() => {
    if (!isDrawerVisible) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [closeDrawer, isDrawerVisible]);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 border-b border-[#efeeed] bg-white",
          responsive.showOnlyDesktop,
        ].join(" ")}
      >
        <div className="mx-auto flex h-[63px] max-w-[1200px] items-center justify-between px-6">
          <a className="flex items-center" href="#">
            <BrandLogo modeValue={modeValue} />
          </a>

          <nav className="hidden items-center gap-3 text-[15px] font-medium text-[#7e7e7b] md:flex">
            {navItems.map((item) => {
              const link = navLinks[item.key];
              const href = link?.href ?? "#";
              const external = Boolean(link?.external);
              return (
                <a
                  className="rounded-full px-3 py-2 hover:bg-[#f9f8f7]"
                  href={href}
                  key={item.key}
                  {...(external ? { rel: "noreferrer", target: "_blank" } : {})}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LangToggle />
            <ModeToggle
              aria-label={modeAriaLabel}
              onValueChange={onModeValueChange}
              value={modeValue}
            />
            <a
              className="rounded-full bg-[#ffcb31] px-3 py-1.5 text-[14px] font-medium text-black cursor-pointer"
              href={trialHref}
              rel="noreferrer"
              target="_blank"
            >
              {t("gnb.runApp")}
            </a>
          </div>
        </div>
      </header>

      <header
        className={[
          "sticky top-0 z-50 border-b border-[#efeeed] bg-white",
          responsive.showOnlyTablet,
        ].join(" ")}
      >
        <div className="mx-auto flex h-[63px] max-w-[800px] items-center justify-between px-4">
          <a className="flex items-center" href="#">
            <BrandLogo modeValue={modeValue} />
          </a>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button
              aria-controls="navigation-drawer"
              aria-expanded={isDrawerOpen}
              aria-label={t("gnb.openMenu")}
              className="grid size-9 place-items-center"
              onClick={openDrawer}
              type="button"
            >
              <img
                alt=""
                className="h-[33px] w-6"
                src={assets.gnb.iconMenuTablet}
              />
            </button>
          </div>
        </div>
      </header>

      <header
        className={[
          "sticky top-0 z-50 border-b border-[#efeeed] bg-white",
          responsive.showOnlyMobile,
        ].join(" ")}
      >
        <div className="mx-auto flex h-[63px] min-w-[320px] items-center justify-between px-4">
          <a className="flex items-center" href="#">
            <BrandLogo modeValue={modeValue} />
          </a>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button
              aria-controls="navigation-drawer"
              aria-expanded={isDrawerOpen}
              aria-label={t("gnb.openMenu")}
              className="grid size-9 place-items-center"
              onClick={openDrawer}
              type="button"
            >
              <img
                alt=""
                className="h-[33px] w-6"
                src={assets.gnb.iconMenuMobile}
              />
            </button>
          </div>
        </div>
      </header>

      {isDrawerVisible ? (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label={t("gnb.closeMenu")}
            className={[
              "absolute inset-0 bg-[rgba(0,0,0,0.4)] transition-opacity duration-200 ease-out",
              isDrawerOpen ? "opacity-80" : "opacity-0",
            ].join(" ")}
            onClick={closeDrawer}
            type="button"
          />

          <aside
            aria-modal="true"
            className={[
              "absolute inset-0 h-full w-screen bg-white p-4",
              "transition-transform duration-300 ease-out will-change-transform",
              isDrawerOpen ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
            id="navigation-drawer"
            role="dialog"
          >
            <div className="flex h-full flex-col items-start justify-between">
              <div className="flex w-full flex-col gap-8">
                <div className="flex w-full items-center justify-between pt-1">
                  <a className="flex items-center" href="#">
                    <BrandLogo modeValue={modeValue} />
                  </a>
                  <button
                    aria-label={t("gnb.closeMenu")}
                    className="grid size-6 place-items-center"
                    onClick={closeDrawer}
                    type="button"
                  >
                    <img alt="" className="size-6" src={assets.gnb.iconClose} />
                  </button>
                </div>

                <nav className="flex w-full flex-col gap-1">
                  {navItems.map((item) => {
                    const link = navLinks[item.key];
                    const href = link?.href ?? "#";
                    const external = Boolean(link?.external);
                    return (
                      <a
                        className="py-2 text-[16px] font-medium leading-[1.5] text-[#7e7e7b]"
                        href={href}
                        key={item.key}
                        onClick={closeDrawer}
                        {...(external
                          ? { rel: "noreferrer", target: "_blank" }
                          : {})}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <LangToggle />
                <ModeToggle
                  aria-label={modeAriaLabel}
                  onValueChange={onModeValueChange}
                  value={modeValue}
                />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
