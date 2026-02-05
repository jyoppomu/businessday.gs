import {join} from "path";

import type {
  ResolvedPluginOptions,
  ResolvedRollupPluginOptions,
  PluginOptions,
  RollupPluginOptions,
} from "./types";

const defaultOptions: ResolvedRollupPluginOptions = {
  include: ["**/*"],
  manifest: {
    copy: false,
    filepath: join("src", "appsscript.json"),
  },
  entrypoints: {
    comment: true,
    autoGlobalExports: false,
    exportsIdentifierName: "exports",
    globalIdentifierName: "global",
  },
  verbose: false,
};

const mergeOptions = <T extends PluginOptions>(
  defaultOptions: T,
  inputOptions?: PluginOptions
): ResolvedPluginOptions<T> => {
  return Object.assign(
    {},
    defaultOptions,
    inputOptions
  ) as unknown as ResolvedPluginOptions<T>;
};

const resolvePluginOptions = (
  options?: RollupPluginOptions
): ResolvedRollupPluginOptions => {
  if (!options) {
    return defaultOptions;
  }

  const configuredOptions = mergeOptions(defaultOptions, options);
  configuredOptions.manifest = mergeOptions(
    defaultOptions.manifest,
    options.manifest
  );
  configuredOptions.entrypoints = mergeOptions(
    defaultOptions.entrypoints,
    options.entrypoints
  );

  return configuredOptions;
};

export default resolvePluginOptions;
