import defineRollupPluginToInsertEntrypoints from "./entrypoints.ts";
import defineRollupPluginToCopyManifest from "./manifest.ts";
import resolvePluginOptions from "./options.ts";

import type {RollupPluginOptions} from "./types";
import type {Plugin} from "rollup";

const defineAppsScriptRollupPlugin = (
  options?: RollupPluginOptions
): Plugin => {
  const resolvedOptions = resolvePluginOptions(options);

  const {outputOptions, transform, banner} =
    defineRollupPluginToInsertEntrypoints(resolvedOptions);

  const {generateBundle} = defineRollupPluginToCopyManifest(resolvedOptions);
  return {
    name: "apps-script-rollup-plugin",
    onLog() {
      if (!resolvedOptions.verbose) {
        return false;
      }
    },
    outputOptions,
    transform,
    banner,
    generateBundle,
  };
};

export default defineAppsScriptRollupPlugin;
