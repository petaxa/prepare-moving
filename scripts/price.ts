/** 値段 */

import { data, purchaseTiming } from "../data/data.ts";
import path from "path";
import fs from "fs";

type Ast = {
  [minCategory in (typeof purchaseTiming)[number]]: {
    name: string;
    priceOrBring: string;
    priceNum: number;
  }[];
};

const initialAst: Ast = {
  now: [],
  afterApril: [],
};
const ast: Ast = data.reduce((acc, cur) => {
  if (cur.price !== "もってく") {
    acc[cur.purchaseTiming].push({
      name: cur.name,
      priceOrBring: `${cur.price.toLocaleString("ja-JP")}円`,
      priceNum: cur.price,
    });
  }

  return acc;
}, initialAst);

const renderItem = (item: Ast[keyof Ast][number]): string[] => {
  const ary: string[] = [];
  ary.push(`- ${item.name}: ${item.priceOrBring}\n`);
  return ary;
};

const render = () => {
  const md: string[] = [];

  md.push(`# 値段\n`);
  md.push(`\n`);

  md.push("## 入居前\n");
  md.push(`\n`);
  md.push(
    ast.now
      .map((item) => renderItem(item))
      .flat()
      .join("")
  );
  md.push(`\n`);
  md.push(
    `計**${ast.now
      .reduce((acc, cur) => acc + cur.priceNum, 0)
      .toLocaleString("ja-JP")}円**\n`
  );
  md.push(`\n`);

  md.push("## 4月以降に買う\n");
  md.push(`\n`);
  md.push(
    ast.afterApril
      .map((item) => renderItem(item))
      .flat()
      .join("")
  );
  md.push(`\n`);
  md.push(
    `計**${ast.afterApril
      .reduce((acc, cur) => acc + cur.priceNum, 0)
      .toLocaleString("ja-JP")}円**\n`
  );
  md.push(`\n`);

  const output = md.join("").trimEnd() + "\n";
  const outPath = path.resolve(import.meta.dirname, "../docs/price.md");

  // フォルダがなければ作成
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`✅ Markdown を出力しました: ${outPath}`);
};
render();
