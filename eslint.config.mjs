import path from "node:path";
import {fileURLToPath} from "node:url";

import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import {defineConfig, globalIgnores} from "eslint/config";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["dist/*"]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "prettier"
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".mjs", ".cjs", ".ts", ".tsx", ".d.ts"],
        },
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      semi: [2, "always"],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-namespace": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js 組み込みモジュール (fs, path など)
            "external", // npm パッケージ
            "internal", // 内部モジュール (エイリアスなど)
            ["parent", "sibling"], // 親/兄弟ディレクトリ
            "index", // index ファイル
            "object", // object-imports
            "type", // type imports
          ],
          "newlines-between": "always", // グループ間に空行を入れる
          alphabetize: {
            order: "asc", // アルファベット昇順
            caseInsensitive: true, // 大文字小文字を区別しない
          },
        },
      ],
    },
  },
]);
