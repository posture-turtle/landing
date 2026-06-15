import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, TextField } from "@gbgr/ui";
import { useTranslation } from "react-i18next";

import { assets } from "../assets";
import { responsive } from "../responsive";
import { trackDownload, trackEmailSubmit } from "../../../utils/analytics";

type DownloadLinks = {
  macArm64Dmg: string;
  macX64Dmg: string;
  windowsExe: string;
  releasePage: string;
};

const releaseBaseUrl =
  (import.meta.env.VITE_RELEASE_BASE_URL as string | undefined)?.replace(/\/+$/, "") ??
  "https://releases.postureturtle.com";
const manifestCandidatesEnv = (import.meta.env.VITE_RELEASE_MANIFEST_CANDIDATES as
  string | undefined)?.trim();
const explicitReleaseManifestUrl = (import.meta.env.VITE_RELEASE_MANIFEST_URL as
  string | undefined)?.trim();
const fallbackReleaseVersion =
  (import.meta.env.VITE_RELEASE_FALLBACK_VERSION as string | undefined)?.trim() ??
  "0.1.23";
const fallbackReleasePrefix = `v${fallbackReleaseVersion}`;

function isFullyQualifiedUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function buildReleaseManifestCandidates() {
  const candidates = new Set<string>();
  const fallbackManifestUrl = `${releaseBaseUrl}/${fallbackReleasePrefix}/latest.json`;
  const rootManifestUrl = `${releaseBaseUrl}/latest.json`;

  if (explicitReleaseManifestUrl) {
    candidates.add(explicitReleaseManifestUrl);
  }

  if (manifestCandidatesEnv) {
    for (const item of manifestCandidatesEnv.split(",")) {
      const candidate = item.trim();
      if (!candidate) continue;
      candidates.add(candidate);
    }
  }

  candidates.add(rootManifestUrl);
  candidates.add(fallbackManifestUrl);

  return Array.from(candidates).map(candidate => {
    if (isFullyQualifiedUrl(candidate)) return candidate;
    if (candidate.startsWith("/")) {
      return `${releaseBaseUrl}${candidate}`;
    }
    return `${releaseBaseUrl}/${candidate}`;
  });
}

const latestReleaseManifestCandidates = buildReleaseManifestCandidates();

const fallbackDownloadLinks: DownloadLinks = {
  macArm64Dmg: `${releaseBaseUrl}/${fallbackReleasePrefix}/${encodeURIComponent(
    `거부기린_${fallbackReleaseVersion}_aarch64.dmg`,
  )}`,
  macX64Dmg: `${releaseBaseUrl}/${fallbackReleasePrefix}/${encodeURIComponent(
    `거부기린_${fallbackReleaseVersion}_x64.dmg`,
  )}`,
  windowsExe: `${releaseBaseUrl}/${fallbackReleasePrefix}/${encodeURIComponent(
    `거부기린_${fallbackReleaseVersion}_x64-setup.exe`,
  )}`,
  releasePage: `${releaseBaseUrl}/${fallbackReleasePrefix}/latest.json`,
};

type TauriReleaseManifest = {
  version?: string;
  platforms?: Record<
    string,
    {
      url?: string;
    }
  >;
};

function getPlatformUrl(manifest: TauriReleaseManifest, ...keys: string[]) {
  for (const key of keys) {
    const url = manifest.platforms?.[key]?.url;
    if (url) return url;
  }
  return null;
}

function replaceFileName(url: string, fileName: string) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split("/");
  segments[segments.length - 1] = encodeURIComponent(fileName);
  parsed.pathname = segments.join("/");
  return parsed.toString();
}

function getMacDmgUrl(updaterUrl: string, version: string, arch: "aarch64" | "x64") {
  const parsed = new URL(updaterUrl);
  const updaterFileName = decodeURIComponent(parsed.pathname.split("/").pop() ?? "");
  const appName = updaterFileName
    .replace(/_(aarch64|x64)\.app\.tar\.gz$/i, "")
    .replace(/\.app\.tar\.gz$/i, "");

  return replaceFileName(updaterUrl, `${appName}_${version}_${arch}.dmg`);
}

async function resolveLatestReleaseManifest(): Promise<{ manifest: TauriReleaseManifest; manifestUrl: string }> {
  const diagnostics: string[] = [];

  for (const candidate of latestReleaseManifestCandidates) {
    try {
      const response = await fetch(candidate, {
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = (await response.json()) as TauriReleaseManifest;
        return { manifest: data, manifestUrl: candidate };
      }

      diagnostics.push(`HTTP ${response.status} ${candidate}`);
    } catch {
      diagnostics.push(`network error ${candidate}`);
    }
  }

  throw new Error(
    `Failed to fetch latest release manifest. Tried: ${diagnostics.join(", ")}`,
  );
}

async function resolveLatestDownloadLinks(): Promise<DownloadLinks> {
  const { manifest, manifestUrl } = await resolveLatestReleaseManifest();
  const data = manifest;
  const version = data.version ?? fallbackReleaseVersion;

  const macArm64UpdaterUrl = getPlatformUrl(data, "darwin-aarch64", "darwin-aarch64-app");
  const macX64UpdaterUrl = getPlatformUrl(data, "darwin-x86_64", "darwin-x86_64-app");
  const windowsExe = getPlatformUrl(data, "windows-x86_64-nsis", "windows-x86_64");

  const macArm64Dmg = macArm64UpdaterUrl
    ? getMacDmgUrl(macArm64UpdaterUrl, version, "aarch64")
    : null;
  const macX64Dmg = macX64UpdaterUrl ? getMacDmgUrl(macX64UpdaterUrl, version, "x64") : null;

  if (!macArm64Dmg || !macX64Dmg || !windowsExe) {
    throw new Error("Latest release assets missing expected files");
  }

  return {
    macArm64Dmg,
    macX64Dmg,
    windowsExe,
    releasePage: manifestUrl,
  };
}

function isLikelyEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

type EmailFormProps = {
  className?: string;
};

type SendDownloadLinkResponse = {
  timestamp?: string;
  success?: boolean;
  code?: string;
  message?: string;
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
const landingDownloadEndpoint = apiBaseUrl
  ? `${apiBaseUrl.replace(/\/+$/, "")}/landing/download`
  : "/landing/download";

function EmailForm({ className }: EmailFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  const canSend = useMemo(
    () => status !== "sending" && isLikelyEmail(email),
    [email, status],
  );

  const onSend = useCallback(async () => {
    const trimmed = email.trim();
    if (!isLikelyEmail(trimmed)) {
      setStatus("error");
      setMessage(t("hero.emailInvalid"));
      return;
    }

    setStatus("sending");
    setMessage("");
    trackEmailSubmit('start');

    try {
      const response = await fetch(landingDownloadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: trimmed }),
      });

      let data: SendDownloadLinkResponse | null = null;
      try {
        data = (await response.json()) as SendDownloadLinkResponse;
      } catch {
        // ignore non-json response body
      }

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || t("hero.emailError"));
      }

      setStatus("sent");
      setMessage(data?.message || t("hero.emailSent"));
      trackEmailSubmit('success');
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : t("hero.emailError"),
      );
      trackEmailSubmit('error');
    }
  }, [email, t]);

  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <TextField
        className="gbgr-text-field--compact w-full"
        inputMode="email"
        onChange={(event) => {
          setEmail((event.target as HTMLInputElement).value);
          if (status !== "idle") {
            setStatus("idle");
            setMessage("");
          }
        }}
        placeholder={t("hero.emailPlaceholder")}
        type="email"
        value={email}
      />
      <Button
        className="w-full"
        disabled={!canSend}
        type="button"
        onPress={onSend}
      >
        {status === "sending" ? t("hero.emailSending") : t("hero.emailSend")}
      </Button>
      {message ? (
        <p
          className={[
            "mt-1 text-[11px] font-medium leading-[1.5]",
            status === "error" ? "text-red-600" : "text-[#7e7e7b]",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks>(fallbackDownloadLinks);

  useEffect(() => {
    let cancelled = false;

    const storageKey = "gbgr.downloadLinks.latest";
    const maxAgeMs = 1000 * 60 * 60; // 1 hour

    const load = async () => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as { updatedAt: number; links: DownloadLinks };
          if (parsed?.updatedAt && parsed?.links && Date.now() - parsed.updatedAt < maxAgeMs) {
            setDownloadLinks(parsed.links);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }

      try {
        const latest = await resolveLatestDownloadLinks();
        if (cancelled) return;
        setDownloadLinks(latest);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify({ updatedAt: Date.now(), links: latest }));
        } catch {
          // ignore
        }
      } catch {
        // ignore and keep fallback
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section
        className={["bg-[#f9f8f7] pt-[72px]", responsive.showOnlyDesktop].join(
          " ",
        )}
      >
        <div className="mx-auto flex max-w-[1016px] flex-col items-center px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <img alt="" className="size-20" src={assets.hero.appLogo} />
            <h1 className="text-[44px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#212121] sm:text-[58px] sm:leading-[1.6]">
              {t("hero.title")}
            </h1>
            <p className="text-[18px] font-semibold leading-[1.5] text-[#6a6966] sm:text-[20px]">
              <span className="block">
                {t("hero.subtitle1")}
              </span>
              <span className="block">
                {t("hero.subtitle2")}
              </span>
            </p>
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-[#ffcb31] px-6 py-3 text-[18px] font-medium text-black"
                href={downloadLinks.macArm64Dmg}
                rel="noreferrer"
                target="_blank"
                onMouseDown={() => trackDownload('macos')}
              >
                <img alt="" className="size-6" src={assets.hero.iconApple} />
                {t("hero.macDownload")}
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full bg-[#ffcb31] px-6 py-3 text-[18px] font-medium text-black"
                href={downloadLinks.windowsExe}
                rel="noreferrer"
                target="_blank"
                onMouseDown={() => trackDownload('windows')}
              >
                <img alt="" className="size-6" src={assets.hero.iconWindows} />
                {t("hero.windowsDownload")}
              </a>
            </div>
            <a
              className="text-[14px] font-medium text-[#7e7e7b] underline"
              href={downloadLinks.macX64Dmg}
              rel="noreferrer"
              target="_blank"
              onMouseDown={() => trackDownload('macos_intel')}
            >
              {t("hero.intelDownload")}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[1320px] px-6 pb-[96px]">
          <img
            alt={t("hero.altServiceScreen")}
            className="w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
            decoding="async"
            fetchPriority="high"
            height={1054}
            src={assets.hero.mock}
            width={1600}
          />
        </div>
      </section>

      <section
        className={[
          "bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_50%,#FFE28A_75%,#FFBF00_100%)] pt-[68px]",
          responsive.showOnlyTablet,
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-[40px] px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <img alt="" className="size-20" src={assets.hero.appLogo} />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-[36px] font-extrabold leading-[1.5] tracking-[-0.02em] text-[#212121]">
                {t("hero.title")}
              </h1>
              <p className="text-[16px] font-medium leading-[1.5] text-[#6a6966]">
                <span className="block">
                  {t("hero.subtitle1")}
                </span>
                <span className="block">
                  {t("hero.subtitle2")}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full max-w-[360px]">
            <EmailForm />
            <p className="mt-4 text-[10px] font-medium leading-[1.5] text-[#7e7e7b]">
              <span className="block">{t("hero.pcOnly1")}</span>
              <span className="block">
                {t("hero.pcOnly2")}
              </span>
            </p>
          </div>
        </div>

        <div className=" ">
          <div className="mx-auto max-w-[760px] px-4 pb-[24px] pt-[24px]">
            <img
              alt={t("hero.altServiceScreen")}
              className="w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
              decoding="async"
              fetchPriority="high"
              height={659}
              src={assets.hero.tabletMock}
              width={1000}
            />
          </div>
        </div>
      </section>

      <section
        className={[
          "bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_50%,#FFE28A_75%,#FFBF00_100%)] pt-[68px]",
          responsive.showOnlyMobile,
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-[320px] min-w-0 flex-col items-center gap-[40px] overflow-hidden px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <img alt="" className="size-20" src={assets.hero.appLogo} />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-[24px] font-extrabold leading-[1.5] tracking-[-0.02em] text-[#212121]">
                {t("hero.title")}
              </h1>
              <p className="text-[14px] font-medium leading-[1.5] text-[#6a6966]">
                <span className="block">
                  {t("hero.subtitle1")}
                </span>
                <span className="block">
                  {t("hero.subtitle2")}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full">
            <EmailForm />
            <p className="mt-4 text-[10px] font-medium leading-[1.5] text-[#7e7e7b]">
              <span className="block">{t("hero.pcOnly1")}</span>
              <span className="block">
                {t("hero.pcOnly2")}
              </span>
            </p>
          </div>
        </div>

        <div className="">
          <div className="mx-auto max-w-[360px] px-4 pb-[24px] pb-[133px]">
            <img
              alt={t("hero.altServiceScreen")}
              className="w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
              decoding="async"
              fetchPriority="high"
              height={474}
              src={assets.hero.mobileMock}
              width={720}
            />
          </div>
        </div>
      </section>
    </>
  );
}
