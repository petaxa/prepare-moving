/** どこでなにかう */

import { data, retailer } from "../data/data";
import path from "path";
import fs from "fs";

type Ast = {
  [minCategory in (typeof retailer)[number]]: {
    name: string;
    priceOrBring: string;
    item: (typeof data)[number]["item"];
    memo?: string;
  }[];
};

const initialAst: Ast = {
  ビックカメラ: [],
  合羽橋系: [],
  ニトリ系: [],
  ホームセンター: [],
  Amazon: [],
};
const ast: Ast = data.reduce((acc, cur) => {
  if (cur.price !== "もってく") {
    acc[cur.retailer].push({
      name: cur.name,
      priceOrBring: `${cur.price.toLocaleString("ja-JP")}円`,
      item: cur.item,
      memo: cur.memo,
    });
  }

  return acc;
}, initialAst);

const renderItem = (item: Ast[keyof Ast][number]): string[] => {
  const ary: string[] = [];

  ary.push(`- ${item.name}\n`);
  if (!!item.item.name) {
    ary.push(`  - [${item.item.name}](${item.item.url})\n`);
    ary.push(`    - ${item.priceOrBring}\n`);
  } else {
    ary.push(`  - ${item.priceOrBring}\n`);
  }

  if (!!item.memo) ary.push(`  - ${item.memo}\n`);
  return ary;
};

const render = () => {
  const md: string[] = [];

  md.push(`# どこでなにかう\n`);
  md.push(`\n`);

  retailer.forEach((name) => {
    md.push(`## ${name}\n`);
    md.push(`\n`);

    const items = ast[name];
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

  const output = md.join("").trimEnd() + "\n";
  const outPath = path.resolve(__dirname, "../docs/retailer.md");

  // フォルダがなければ作成
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`✅ Markdown を出力しました: ${outPath}`);
};
render();
