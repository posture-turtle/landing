import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { assets } from "../assets";
import { responsive } from "../responsive";
import { trackCtaClick } from "../../../utils/analytics";

export function Cta() {
  const { t } = useTranslation();
  const trialHref = "http://demo.bugi.co.kr/";

  const handleTrialClick = useCallback(() => {
    trackCtaClick('trial');
  }, []);

  return (
    <>
      <section
        data-ga-cta-section
        className={[
          "relative flex items-center justify-center py-[160px] sm:py-[200px]",
          responsive.showOnlyDesktop,
        ].join(" ")}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={assets.cta.bg}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.8),rgba(255,255,255,0)_60%)]" />

        <div className="relative flex flex-col items-center gap-[60px] px-6 text-center">
          <div className="flex flex-col items-center gap-[10px]">
            <div className="gbgr-cta-heading text-[32px] font-bold leading-[1.2] text-[#212121] sm:text-[40px] sm:leading-[1.6]">
              <span className="block">{t("cta.title1")}</span>
              <span className="block">{t("cta.title2")}</span>
            </div>
            <div className="gbgr-cta-subtitle text-[18px] font-semibold leading-[1.6] text-[#6a6966] sm:text-[20px]">
              {t("cta.subtitle")}
            </div>
          </div>

          <a
            className="rounded-full bg-black px-7 py-4 text-[18px] font-medium text-white sm:text-[20px] cursor-pointer"
            href={trialHref}
            rel="noreferrer"
            target="_blank"
            onClick={handleTrialClick}
          >
            {t("cta.button")}
          </a>
        </div>
      </section>

      <section
        data-ga-cta-section
        className={["relative h-[360px]", responsive.showOnlyTablet].join(" ")}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={assets.cta.tabletBg}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.95),rgba(255,255,255,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.9),rgba(255,255,255,0)_60%)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex w-full flex-col items-center gap-[30px] px-4 text-center">
            <div className="flex flex-col items-center gap-[10px]">
              <div className="gbgr-cta-heading text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("cta.title1")}</div>
                <div>{t("cta.title2")}</div>
              </div>
              <div className="gbgr-cta-subtitle text-[14px] font-medium leading-[1.5] text-[#6a6966]">
                {t("cta.subtitle")}
              </div>
            </div>
            <a
              className="rounded-full bg-black px-5 py-2 text-[14px] font-medium text-white cursor-pointer"
              href={trialHref}
              rel="noreferrer"
              target="_blank"
              onClick={handleTrialClick}
            >
              {t("cta.button")}
            </a>
          </div>
        </div>
      </section>

      <section
        data-ga-cta-section
        className={["relative h-[297px]", responsive.showOnlyMobile].join(" ")}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={assets.cta.mobileBg}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.95),rgba(255,255,255,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.9),rgba(255,255,255,0)_60%)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex w-full flex-col items-center px-4 text-center">
            <div className="gbgr-cta-heading text-[22px] font-bold leading-[1.5] text-[#212121]">
              <div>{t("cta.title1")}</div>
              <div>{t("cta.title2")}</div>
            </div>
            <div className="gbgr-cta-subtitle mt-[10px] text-[14px] font-medium leading-[1.5] text-[#6a6966]">
              {t("cta.subtitle")}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
