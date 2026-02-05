import {existsSync, readFileSync} from "fs";
import {join} from "path";

import {getRelativePath} from "./utils";

import type {ResolvedRollupPluginOptions} from "./types";
import type {Plugin} from "rollup";

const loadManifest = (sourceFile: string) => {
  return readFileSync(sourceFile, {
    encoding: "utf8",
  });
};

const defineRollupPluginToCopyManifest = (
  resolvedOptions: ResolvedRollupPluginOptions
): Plugin => {
  return {
    name: "copy-manifest",
    generateBundle() {
      if (!resolvedOptions.manifest.copy) {
        return;
      }
      if (!resolvedOptions.manifest.filepath) {
        return;
      }
      const manifestFilepath = join(
        process.cwd(),
        resolvedOptions.manifest.filepath
      );
      this.info("copy manifest file: " + getRelativePath(manifestFilepath));

      if (!existsSync(manifestFilepath)) {
        this.error("not found: " + getRelativePath(manifestFilepath));
      }
      this.emitFile({
        type: "asset",
        name: "manifest",
        fileName: "appsscript.json",
        source: loadManifest(manifestFilepath),
      });
    },
  };
};

export default defineRollupPluginToCopyManifest;
