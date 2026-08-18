import { useEffect, useState } from "react";

// Rechartsはクリップパス等のID生成にSSR/クライアントで一致しないカウンターを
// 使うため、マウント後にのみ描画してハイドレーション不一致を避ける。
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
