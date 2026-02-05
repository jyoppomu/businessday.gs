export type CopyManifestOptions = {
  copy: boolean;
  filepath?: string;
};

export type ResolvedCopyManifestOptions = Required<CopyManifestOptions>;

export type InsertEntrypointsOptions = {
  comment?: boolean;
  autoGlobalExports?: boolean;
  exportsIdentifierName?: string;
  globalIdentifierName?: string;
};

export type DefaultInsertEntrypointsOptions = Required<
  Pick<InsertEntrypointsOptions, "comment">
> &
  Omit<InsertEntrypointsOptions, "comment">;

export type RollupPluginOptions = {
  include?: Array<string>;
  manifest?: CopyManifestOptions;
  entrypoints?: InsertEntrypointsOptions;
  verbose?: boolean;
};

export type ResolvedRollupPluginOptions = Required<RollupPluginOptions>;

export type PluginOptions =
  | RollupPluginOptions
  | CopyManifestOptions
  | InsertEntrypointsOptions;

export type ResolvedPluginOptions<T> = T extends RollupPluginOptions
  ? ResolvedRollupPluginOptions
  : T extends InsertEntrypointsOptions
    ? DefaultInsertEntrypointsOptions
    : ResolvedCopyManifestOptions;
