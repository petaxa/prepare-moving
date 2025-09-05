import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "引っ越しをしよう!",
  base: "/prepare-moving/",
  description: "引っ越し準備で必要なすべての情報をここにおいて幸せになります。",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "ホーム", link: "/" },
      { text: "用意するもの", link: "/prepare-items" },
      { text: "値段", link: "/price" },
      { text: "どこでなにかう", link: "/retailer" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/petaxa/prepare-moving" },
    ],
  },
});
