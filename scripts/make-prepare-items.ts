/** 用意するもの */

import path from "path";
import fs from "fs";
import { category, data } from "../data/data";

type Ast = {
  [minCategory in (typeof category)[keyof typeof category]["minCategory"][number]]: {
    name: string;
    priceOrBring: string;
    prepared: boolean;
  }[];
};

const initialAst: Ast = {
  調理器具: [],
  キッチン掃除用具: [],
  食器: [],
  キッチン家電: [],
  キッチン家具: [],
  リビング家具: [],
  リビング家電: [],
  デバイス類: [],
  本: [],
  洗濯用品: [],
  洗濯家電: [],
  入浴用品: [],
  お風呂掃除: [],
  トイレ用品: [],
  トイレ掃除: [],
};
const ast: Ast = data.reduce((acc, cur) => {
  acc[cur.category].push({
    name: cur.name,
    priceOrBring:
      cur.price === "もってく"
        ? "もってく"
        : `${cur.price.toLocaleString("ja-JP")}円`,
    prepared: cur.prepared,
  });
  return acc;
}, initialAst);

const renderItem = (item: Ast[keyof Ast][number]): string[] => {
  const ary: string[] = [];
  const mark = item.prepared ? "x" : " ";
  ary.push(`- [${mark}] ${item.name}\n`);
  ary.push(`  - ${item.priceOrBring}\n`);
  return ary;
};

const render = () => {
  const md: string[] = [];

  md.push(`# 用意するもの\n`);
  md.push(`\n`);

  Object.values(category).forEach((group) => {
    md.push(`## ${group.name}\n`);
    md.push(`\n`);

    group.minCategory.forEach((sub) => {
      md.push(`### ${sub}\n`);
      md.push(`\n`);

      const items = ast[sub as keyof Ast];
      if (items && items.length > 0) {
        md.push(
          items
            .map((item) => renderItem(item))
            .flat()
            .join("")
        );
        md.push(`\n`);
      }
    });
  });

  const output = md.join("").trimEnd() + "\n";
  const outPath = path.resolve(__dirname, "../docs/prepare-items.md");

  // フォルダがなければ作成
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`✅ Markdown を出力しました: ${outPath}`);
};
render();
