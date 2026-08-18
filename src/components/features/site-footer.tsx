const LINKS_URL = "https://links-service.jp/";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-6 text-center text-xs text-muted-foreground">
        <p>
          このアプリは、未経験からITエンジニアを目指す方向けのポートフォリオ見本として
          就労移行支援事業所リンクスが作成したサンプルです。
        </p>
        <a
          href={LINKS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 静的な小さいロゴのため next/image の最適化は不要 */}
          <img
            src="/images/logo.webp"
            alt="就労移行支援事業所リンクス"
            width={201}
            height={48}
            className="h-12 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}
