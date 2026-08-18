export const DEMO_ACCOUNT_EMAIL = "demo@reading-log.app";

export function isDemoAccount(email: string | null | undefined) {
  return email === DEMO_ACCOUNT_EMAIL;
}

export const DEMO_ACCOUNT_MESSAGE =
  "デモアカウントはデータの変更ができません。動作確認は新規登録したアカウントでお試しください。";
