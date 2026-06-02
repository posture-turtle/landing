import { useTranslation } from "react-i18next";

import { assets } from "../assets";
import { responsive } from "../responsive";

export function WhySection() {
  const { t } = useTranslation();

  return (
    <>
      <section
        className={[
          "relative aspect-[2/1] w-full overflow-hidden",
          responsive.showOnlyDesktop,
        ].join(" ")}
      >
        <img
          alt=""
          className="absolute  inset-0 h-full w-full object-cover"
          decoding="async"
          height={801}
          loading="lazy"
          src={assets.why.bg}
          width={1600}
        />

        <div className="relative mx-auto h-full max-w-[1200px] px-6">
          <div className="pt-[181px] pl-30">
            <h2 className="max-w-[560px] text-[38px] font-bold leading-[1.25] text-white sm:text-[50px]">
              <span className="block">{t("why.title1")}</span>
              <span className="block">{t("why.title2")}</span>
            </h2>
            <p className="mt-10 max-w-[560px] text-[16px] font-medium leading-[1.5] text-[#efeeed] sm:text-[18px]">
              {t("why.desc")}
            </p>
          </div>
        </div>
      </section>

      <section
        className={[
          "relative h-[409px] w-full overflow-hidden",
          responsive.showOnlyTablet,
        ].join(" ")}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          height={488}
          loading="lazy"
          src={assets.why.tabletBg}
          width={1000}
        />
        <div className="relative mx-auto h-full max-w-[800px] px-10 pt-10">
          <h2 className="text-[32px] font-bold leading-[1.5] text-white">
            <span className="block">{t("why.title1")}</span>
            <span className="block">{t("why.title2")}</span>
          </h2>
          <p className="mt-5 w-[288px] text-[16px] font-medium leading-[1.5] text-[#efeeed]">
            {t("why.desc")}
          </p>
        </div>
      </section>

      <section
        className={[
          "relative h-[201px] w-full overflow-hidden",
          responsive.showOnlyMobile,
        ].join(" ")}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          height={312}
          loading="lazy"
          src={assets.why.mobileBg}
          width={640}
        />
        <div className="relative mx-auto h-full max-w-[320px] px-4 pt-4">
          <h2 className="text-[18px] font-bold leading-[1.5] text-white">
            <span className="block">{t("why.title1")}</span>
            <span className="block">{t("why.title2")}</span>
          </h2>
          <p className="mt-[10px] w-[210px] text-[10px] font-medium leading-[1.5] text-[#efeeed]">
            {t("why.desc")}
          </p>
        </div>
      </section>
    </>
  );
}
