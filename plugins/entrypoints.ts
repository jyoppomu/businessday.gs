import {generate} from "gas-entry-generator";
import {createFilter} from "rollup-pluginutils";

import {getRelativePath} from "./utils";

import type {
  ResolvedRollupPluginOptions,
  InsertEntrypointsOptions,
} from "./types";
import type {Plugin} from "rollup";

const generateEntrypoints = (
  code: string,
  params: InsertEntrypointsOptions
): string[] => {
  const generatedEntrypoints: {
    entryPointFunctions: string;
    globalAssignments: string | undefined;
  } = generate(code, params);
  return generatedEntrypoints.entryPointFunctions
    .replace(/{\n}/g, "{};")
    .split("\n")
    .filter((line) => line.trim() !== "");
};

const defineRollupPluginToInsertEntrypoints = (
  resolvedOptions: ResolvedRollupPluginOptions
): Plugin => {
  const entryPointsString: Array<string> = [];
  const filter = createFilter(resolvedOptions.include);
  return {
    name: "insert-entrypoints",
    outputOptions(options) {
      options.format = "umd"; // cjs
      return options;
    },
    transform(code, id) {
      if (!filter(id)) {
        this.info("excluded target: " + getRelativePath(id));
        return;
      }
      this.info("generated entry points for: " + getRelativePath(id));
      const entryPoints = generateEntrypoints(
        code,
        resolvedOptions.entrypoints
      );
      entryPointsString.push(...entryPoints);
    },
    banner() {
      return ["var global = this;", ...entryPointsString].join("\n");
    },
  };
};

export default defineRollupPluginToInsertEntrypoints;
