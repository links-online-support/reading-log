import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const DEMO_EMAIL = "demo@reading-log.app";
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

  const [techBook, certification, onlineCourse] = await Promise.all([
    db.category.upsert({
      where: { userId_name: { userId: user.id, name: "技術書" } },
      update: {},
      create: { userId: user.id, name: "技術書" },
    }),
    db.category.upsert({
      where: { userId_name: { userId: user.id, name: "資格学習" } },
      update: {},
      create: { userId: user.id, name: "資格学習" },
    }),
    db.category.upsert({
      where: { userId_name: { userId: user.id, name: "オンライン講座" } },
      update: {},
      create: { userId: user.id, name: "オンライン講座" },
    }),
  ]);

  const tagNames = ["JavaScript", "TypeScript", "React", "Next.js", "DB"];
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

  await db.recordTag.deleteMany({ where: { record: { userId: user.id } } });
  await db.record.deleteMany({ where: { userId: user.id } });

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
      status: "IN_PROGRESS" as const,
      rating: null,
      note: "型の絞り込みとジェネリクスのあたりを復習中。",
      categoryId: techBook.id,
      startedAt: new Date("2026-07-01"),
      finishedAt: null,
      tagNames: ["TypeScript"],
    },
    {
      title: "React 公式ドキュメント一周",
      author: null,
      status: "COMPLETED" as const,
      rating: 4,
      note: "Server Components の章が特に参考になった。",
      categoryId: onlineCourse.id,
      startedAt: new Date("2026-06-01"),
      finishedAt: new Date("2026-06-15"),
      tagNames: ["React", "Next.js"],
    },
    {
      title: "基本情報技術者試験 過去問道場",
      author: null,
      status: "IN_PROGRESS" as const,
      rating: null,
      note: "午後問題のアルゴリズム分野を重点的に演習中。",
      categoryId: certification.id,
      startedAt: new Date("2026-07-10"),
      finishedAt: null,
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
