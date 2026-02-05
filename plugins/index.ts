import defineRollupPluginToInsertEntrypoints from "./entrypoints";
import defineRollupPluginToCopyManifest from "./manifest";
import resolvePluginOptions from "./options";

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
