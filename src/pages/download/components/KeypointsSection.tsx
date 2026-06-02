import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { assets } from "../assets";
import { responsive } from "../responsive";

type KeypointProps = {
  label: string;
  titleLines: string[];
  descLines: string[];
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  reverse?: boolean;
  alignRight?: boolean;
  extra?: ReactNode;
};

function Keypoint({
  label,
  titleLines,
  descLines,
  imageSrc,
  imageAlt,
  imageClassName,
  reverse,
  alignRight,
  extra,
}: KeypointProps) {
  return (
    <div
      className={[
        "flex flex-col items-start gap-[40px] lg:flex-row lg:gap-[72px]",

        reverse ? "lg:flex-row-reverse lg:justify-start" : "",
      ].join(" ")}
    >
      <div className="shrink-0">
        <img
          alt={imageAlt}
          className={[
            "w-full max-w-[800px] rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]",
            imageClassName ?? "",
          ].join(" ")}
          decoding="async"
          loading="lazy"
          src={imageSrc}
        />
      </div>

      <div
        className={[
          "pt-0",
          alignRight ? "lg:text-right lg:items-end" : "",
          "flex flex-col gap-6",
        ].join(" ")}
      >
        <div
          className={[
            "flex flex-col gap-2",
            alignRight ? "items-end" : "items-start",
          ].join(" ")}
        >
          <div className="text-[20px] font-medium text-[#ffbf00]">{label}</div>
          <div className="text-[28px] font-bold leading-[1.2] text-[#212121] sm:text-[32px] sm:leading-[1.6]">
            {titleLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
        <div className="text-[18px] font-medium leading-[1.6] text-[#7e7e7b] sm:text-[20px]">
          {descLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        {extra}
      </div>
    </div>
  );
}

export function KeypointsSection() {
  const { t } = useTranslation();

  return (
    <>
      <section
        className={["bg-[#ffffff] py-[160px]", responsive.showOnlyDesktop].join(
          " ",
        )}
      >
        <div className="mx-auto flex max-w-[1320px] flex-col gap-[160px] px-6">
          <Keypoint
            descLines={[t("keypoints.kp1.desc1"), t("keypoints.kp1.desc2")]}
            imageAlt="Keypoint 1"
            imageSrc={assets.keypoints.kp1}
            label={t("keypoints.kp1.label")}
            titleLines={[t("keypoints.kp1.title1"), t("keypoints.kp1.title2")]}
          />

          <Keypoint
            alignRight
            descLines={[t("keypoints.kp2.desc1"), t("keypoints.kp2.desc2")]}
            imageAlt="Keypoint 2"
            imageClassName="!max-w-[635px] !shadow-none !rounded-none"
            imageSrc={assets.keypoints.kp2}
            label={t("keypoints.kp2.label")}
            reverse
            titleLines={[t("keypoints.kp2.title1"), t("keypoints.kp2.title2")]}
          />

          <Keypoint
            descLines={[t("keypoints.kp3.desc1"), t("keypoints.kp3.desc2"), t("keypoints.kp3.desc3")]}
            imageAlt="Keypoint 3"
            imageSrc={assets.keypoints.kp3}
            label={t("keypoints.kp3.label")}
            titleLines={[t("keypoints.kp3.title1"), t("keypoints.kp3.title2")]}
          />

          <Keypoint
            alignRight
            descLines={[t("keypoints.kp4.desc1"), t("keypoints.kp4.desc2")]}
            extra={
              <div className="mt-10">
                <img
                  alt=""
                  className="w-[361px] max-w-full shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                  decoding="async"
                  loading="lazy"
                  src={assets.keypoints.kp4Notif}
                />
              </div>
            }
            imageAlt="Keypoint 4"
            imageSrc={assets.keypoints.kp4}
            label={t("keypoints.kp4.label")}
            reverse
            titleLines={[t("keypoints.kp4.title")]}
          />

          <div className="flex flex-col items-start gap-[40px] lg:flex-row lg:gap-[72px]">
            <div className="flex shrink-0 flex-col items-center gap-6">
              <img
                alt=""
                className="w-[276px] max-w-full shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.kp5Min}
              />
              <img
                alt="Keypoint 5"
                className="w-[275px] max-w-full shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.kp5Med}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-[20px] font-medium text-[#ffbf00]">
                  {t("keypoints.kp5.label")}
                </div>
                <div className="text-[28px] font-bold leading-[1.2] text-[#212121] sm:text-[32px] sm:leading-[1.6]">
                  <div>{t("keypoints.kp5.title1")}</div>
                  <div>{t("keypoints.kp5.title2")}</div>
                </div>
              </div>
              <div className="text-[18px] font-medium leading-[1.6] text-[#7e7e7b] sm:text-[20px]">
                <div>{t("keypoints.kp5.desc1")}</div>
                <div>{t("keypoints.kp5.desc2")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={["bg-white py-[100px]", responsive.showOnlyTablet].join(" ")}
      >
        <div className="mx-auto flex max-w-[720px] flex-col gap-[120px] px-4">
          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 1"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.tabletKp1}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[16px] font-medium text-[#ffbf00]">
                {t("keypoints.kp1.label")}
              </div>
              <div className="text-[28px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp1.title1")}</div>
                <div>{t("keypoints.kp1.title2")}</div>
              </div>
              <div className="text-[16px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp1.desc1")}</div>
                <div>{t("keypoints.kp1.desc2")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 2"
              className="w-full"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.tabletKp2}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[16px] font-medium text-[#ffbf00]">
                {t("keypoints.kp2.label")}
              </div>
              <div className="text-[28px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp2.title1")}</div>
                <div>{t("keypoints.kp2.title2")}</div>
              </div>
              <div className="text-[16px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp2.desc1")}</div>
                <div>{t("keypoints.kp2.desc2")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 3"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.tabletKp3}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[16px] font-medium text-[#ffbf00]">
                {t("keypoints.kp3.label")}
              </div>
              <div className="text-[28px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp3.title1")}</div>
                <div>{t("keypoints.kp3.title2")}</div>
              </div>
              <div className="text-[16px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp3.desc1")}</div>
                <div>{t("keypoints.kp3.desc2")}</div>
                <div>{t("keypoints.kp3.desc3")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 4"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.tabletKp4}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[16px] font-medium text-[#ffbf00]">
                {t("keypoints.kp4.label")}
              </div>
              <div className="text-[28px] font-bold leading-[1.5] text-[#212121]">
                {t("keypoints.kp4.title")}
              </div>
              <div className="text-[16px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp4.desc1")}</div>
                <div>{t("keypoints.kp4.desc2")}</div>
              </div>
              <div className="mt-4">
                <img
                  alt=""
                  className="w-full max-w-[360px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                  decoding="async"
                  loading="lazy"
                  src={assets.keypoints.tabletKp4Notif}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <div className="relative h-[680px] w-full">
              <img
                alt=""
                className="absolute left-0 top-0 w-[361px] max-w-full shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.tabletKp5Min}
              />
              <img
                alt="Keypoint 5"
                className="absolute bottom-0 left-0 w-[353px] max-w-full shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.tabletKp5Med}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp5.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp5.title1")}</div>
                <div>{t("keypoints.kp5.title2")}</div>
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp5.desc1")}</div>
                <div>{t("keypoints.kp5.desc2")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={["bg-white py-[100px]", responsive.showOnlyMobile].join(" ")}
      >
        <div className="mx-auto flex max-w-[320px] flex-col gap-[120px] px-4">
          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 1"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.mobileKp1}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp1.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp1.title1")}</div>
                <div>{t("keypoints.kp1.title2")}</div>
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp1.desc1")}</div>
                <div>{t("keypoints.kp1.desc2")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 2"
              className="w-full"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.mobileKp2}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp2.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp2.title1")}</div>
                <div>{t("keypoints.kp2.title2")}</div>
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp2.desc1")}</div>
                <div>{t("keypoints.kp2.desc2")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 3"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.mobileKp3}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp3.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp3.title1")}</div>
                <div>{t("keypoints.kp3.title2")}</div>
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp3.desc1")}</div>
                <div>{t("keypoints.kp3.desc2")}</div>
                <div>{t("keypoints.kp3.desc3")}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <img
              alt="Keypoint 4"
              className="w-full rounded-[16px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
              decoding="async"
              loading="lazy"
              src={assets.keypoints.mobileKp4}
            />
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp4.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                {t("keypoints.kp4.title")}
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp4.desc1")}</div>
                <div>{t("keypoints.kp4.desc2")}</div>
              </div>
              <div className="mt-4">
                <img
                  alt=""
                  className="w-full max-w-[144px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                  decoding="async"
                  loading="lazy"
                  src={assets.keypoints.mobileKp4Notif}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <div className="relative h-[254px] w-full">
              <img
                alt=""
                className="absolute top-0 w-[144px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.mobileKp5Min}
              />
              <img
                alt="Keypoint 5"
                className="absolute top-[49px] w-[144px] shadow-[0_0_15px_rgba(128,113,82,0.14)]"
                decoding="async"
                loading="lazy"
                src={assets.keypoints.mobileKp5Med}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-medium text-[#ffbf00]">
                {t("keypoints.kp5.label")}
              </div>
              <div className="text-[22px] font-bold leading-[1.5] text-[#212121]">
                <div>{t("keypoints.kp5.title1")}</div>
                <div>{t("keypoints.kp5.title2")}</div>
              </div>
              <div className="text-[12px] font-medium leading-[1.5] text-[#7e7e7b]">
                <div>{t("keypoints.kp5.desc1")}</div>
                <div>{t("keypoints.kp5.desc2")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
