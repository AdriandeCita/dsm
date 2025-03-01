import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  ...compat.config({
    ignorePatterns: [".next/", "node_modules/", "out/", "public/"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": ["warn", { singleQuote: false, semi: true }],
      "react/react-in-jsx-scope": "off",
    },
  }),
];

export default eslintConfig;
