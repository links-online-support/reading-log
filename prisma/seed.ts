import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { DEMO_ACCOUNT_EMAIL } from "../src/lib/demo";

const db = new PrismaClient();

const DEMO_EMAIL = DEMO_ACCOUNT_EMAIL;
const DEMO_PASSWORD = "demo12345";

async function main() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await db.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      name: "デモユーザー",
      email: DEMO_EMAIL,
      password: hashedPassword,
    },
  });

  const [techBook, certification, accounting, business, selfHelp] =
    await Promise.all([
      db.category.upsert({
        where: { userId_name: { userId: user.id, name: "技術書" } },
        update: { color: "blue" },
        create: { userId: user.id, name: "技術書", color: "blue" },
      }),
      db.category.upsert({
        where: { userId_name: { userId: user.id, name: "資格学習" } },
        update: { color: "purple" },
        create: { userId: user.id, name: "資格学習", color: "purple" },
      }),
      db.category.upsert({
        where: { userId_name: { userId: user.id, name: "会計" } },
        update: { color: "amber" },
        create: { userId: user.id, name: "会計", color: "amber" },
      }),
      db.category.upsert({
        where: { userId_name: { userId: user.id, name: "ビジネス" } },
        update: { color: "green" },
        create: { userId: user.id, name: "ビジネス", color: "green" },
      }),
      db.category.upsert({
        where: { userId_name: { userId: user.id, name: "自己啓発" } },
        update: { color: "pink" },
        create: { userId: user.id, name: "自己啓発", color: "pink" },
      }),
    ]);

  const tagNames = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "DB",
    "SQL",
    "Linux",
    "AWS",
    "Java",
    "Python",
    "Git",
    "会計",
    "簿記",
    "ビジネス",
    "自己啓発",
  ];
  const tags = await Promise.all(
    tagNames.map((name) =>
      db.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      }),
    ),
  );
  const tagByName = Object.fromEntries(tags.map((tag) => [tag.name, tag]));

  await db.tag.deleteMany({
    where: { userId: user.id, name: { notIn: tagNames } },
  });
  await db.recordTag.deleteMany({ where: { record: { userId: user.id } } });
  await db.record.deleteMany({ where: { userId: user.id } });
  await db.category.deleteMany({
    where: {
      userId: user.id,
      name: {
        notIn: [
          techBook.name,
          certification.name,
          accounting.name,
          business.name,
          selfHelp.name,
        ],
      },
    },
  });

  const records = [
    {
      title: "リーダブルコード",
      author: "Dustin Boswell",
      status: "COMPLETED" as const,
      rating: 5,
      note: "変数名や関数の分割方法など、今日から使えるプラクティスが多かった。",
      categoryId: techBook.id,
      startedAt: new Date("2026-05-01"),
      finishedAt: new Date("2026-05-20"),
      tagNames: ["JavaScript"],
    },
    {
      title: "サバイバルTypeScript",
      author: null,
      status: "COMPLETED" as const,
      rating: 4,
      note: "型の絞り込みとジェネリクスの章まで読み終えた。実務のコードレビューでも早速使えそうな知識が多かった。",
      categoryId: techBook.id,
      startedAt: new Date("2026-07-01"),
      finishedAt: new Date("2026-07-20"),
      tagNames: ["TypeScript"],
    },
    {
      title: "キタミ式イラストIT塾 基本情報技術者",
      author: "きたみりゅうじ",
      status: "COMPLETED" as const,
      rating: 4,
      note: "午後問題のアルゴリズム分野を中心に一通り読み終えた。次は過去問演習で仕上げたい。",
      categoryId: certification.id,
      startedAt: new Date("2026-07-10"),
      finishedAt: new Date("2026-08-02"),
      tagNames: [],
    },
    {
      title: "SQL アンチパターン",
      author: "Bill Karwin",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: techBook.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["DB"],
    },
    {
      title: "スッキリわかるSQL入門",
      author: "中山清喬",
      status: "COMPLETED" as const,
      rating: 4,
      note: "ドリル形式で手を動かしながら学べたので、SELECT文への苦手意識がなくなった。",
      categoryId: techBook.id,
      startedAt: new Date("2026-02-01"),
      finishedAt: new Date("2026-02-14"),
      tagNames: ["SQL", "DB"],
    },
    {
      title: "Webを支える技術",
      author: "山本陽平",
      status: "COMPLETED" as const,
      rating: 5,
      note: "HTTPやRESTの背景にある設計思想が理解でき、API設計を考える視点が変わった。",
      categoryId: techBook.id,
      startedAt: new Date("2026-03-01"),
      finishedAt: new Date("2026-03-18"),
      tagNames: [],
    },
    {
      title: "独学プログラマー",
      author: "コーリー・アルソフ",
      status: "COMPLETED" as const,
      rating: 4,
      note: "未経験からの学習の進め方や心構えの部分が特に参考になった。",
      categoryId: techBook.id,
      startedAt: new Date("2026-01-05"),
      finishedAt: new Date("2026-01-25"),
      tagNames: ["Python"],
    },
    {
      title: "プロを目指す人のためのTypeScript入門",
      author: "鈴木僚太",
      status: "IN_PROGRESS" as const,
      rating: null,
      note: "型の設計パターンの章を読み進め中。ジェネリクスの実践例が豊富で助かる。",
      categoryId: techBook.id,
      startedAt: new Date("2026-08-01"),
      finishedAt: null,
      tagNames: ["TypeScript"],
    },
    {
      title: "Linuxのしくみ",
      author: "武内覚",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: techBook.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["Linux"],
    },
    {
      title: "達人に学ぶDB設計 徹底指南書",
      author: "ミック",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: techBook.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["DB"],
    },
    {
      title: "ITパスポート試験 対策問題集",
      author: null,
      status: "COMPLETED" as const,
      rating: 3,
      note: "基礎知識の総復習として取り組んだ。次は基本情報の午後対策に進む。",
      categoryId: certification.id,
      startedAt: new Date("2026-04-01"),
      finishedAt: new Date("2026-04-20"),
      tagNames: [],
    },
    {
      title: "Java Silver 合格対策",
      author: null,
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: certification.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["Java"],
    },
    {
      title: "AWS認定 クラウドプラクティショナー対策",
      author: null,
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: certification.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["AWS"],
    },
    {
      title: "LPIC-1 対策テキスト",
      author: null,
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: certification.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["Linux"],
    },
    {
      title: "財務3表一体理解法",
      author: "國貞克則",
      status: "COMPLETED" as const,
      rating: 4,
      note: "貸借対照表・損益計算書・キャッシュフロー計算書のつながりが直感的に理解できた。",
      categoryId: accounting.id,
      startedAt: new Date("2026-01-20"),
      finishedAt: new Date("2026-02-05"),
      tagNames: ["会計"],
    },
    {
      title: "決算書はここだけ読め！",
      author: "前川修満",
      status: "COMPLETED" as const,
      rating: 4,
      note: "自分の会社や取引先の決算書を実際に眺めながら読み進め、数字から会社の状態を読み解く視点が身についた。",
      categoryId: accounting.id,
      startedAt: new Date("2026-07-15"),
      finishedAt: new Date("2026-08-05"),
      tagNames: ["会計"],
    },
    {
      title: "簿記の教科書 日商簿記3級 商業簿記",
      author: "TAC出版",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: accounting.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["簿記"],
    },
    {
      title: "7つの習慣",
      author: "スティーブン・R・コヴィー",
      status: "COMPLETED" as const,
      rating: 5,
      note: "「主体的である」「終わりを思い描くことから始める」の2つが特に印象に残った。",
      categoryId: business.id,
      startedAt: new Date("2026-03-10"),
      finishedAt: new Date("2026-04-01"),
      tagNames: ["ビジネス"],
    },
    {
      title: "イシューからはじめよ",
      author: "安宅和人",
      status: "IN_PROGRESS" as const,
      rating: null,
      note: "「解く前に、そもそも解くべき問題か」を見極める視点を仕事でも意識するようになった。",
      categoryId: business.id,
      startedAt: new Date("2026-07-28"),
      finishedAt: null,
      tagNames: ["ビジネス"],
    },
    {
      title: "OKR シリコンバレー式目標管理手法",
      author: "クリスティーナ・ウォドキー",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: business.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["ビジネス"],
    },
    {
      title: "嫌われる勇気",
      author: "岸見一郎、古賀史健",
      status: "COMPLETED" as const,
      rating: 5,
      note: "アドラー心理学の「課題の分離」という考え方が、対人関係の悩みへの向き合い方を変えてくれた。",
      categoryId: selfHelp.id,
      startedAt: new Date("2026-02-10"),
      finishedAt: new Date("2026-02-28"),
      tagNames: ["自己啓発"],
    },
    {
      title: "人を動かす",
      author: "デール・カーネギー",
      status: "COMPLETED" as const,
      rating: 4,
      note: "相手の立場に立って考えることの大切さを、具体的なエピソードを通じて学べた。",
      categoryId: selfHelp.id,
      startedAt: new Date("2026-04-05"),
      finishedAt: new Date("2026-04-25"),
      tagNames: ["自己啓発"],
    },
    {
      title: "エッセンシャル思考",
      author: "グレッグ・マキューン",
      status: "NOT_STARTED" as const,
      rating: null,
      note: null,
      categoryId: selfHelp.id,
      startedAt: null,
      finishedAt: null,
      tagNames: ["自己啓発"],
    },
  ];

  for (const { tagNames: recordTagNames, ...data } of records) {
    const record = await db.record.create({ data: { ...data, userId: user.id } });
    for (const tagName of recordTagNames) {
      await db.recordTag.create({
        data: { recordId: record.id, tagId: tagByName[tagName].id },
      });
    }
  }

  console.log(`シード完了: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
