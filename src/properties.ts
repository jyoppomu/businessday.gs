/**
 * プロパティ値のパーサ
 */
const propertyParser = {
  /**
   * string 型に変換する
   * @param value 変換対象の文字列
   * @returns string 型に変換された値
   */
  asString: (value: string): string => value,
  /**
   * number 型に変換する
   * @param value 変換対象の文字列
   * @returns number 型に変換された値
   * @throws 変換できない場合は Error を投げる
   */
  asNumber: (value: string): number => {
    const parsed = Number(value);
    // Number() は "Infinity" や "1e400" を非有限な値として受け入れるため isFinite で弾く
    if (!Number.isFinite(parsed)) throw new Error(`invalid number: "${value}"`);
    return parsed;
  },
  /**
   * boolean 型に変換する
   * @param value 変換対象の文字列
   * @returns boolean 型に変換された値
   * @throws 変換できない場合は Error を投げる
   */
  asBoolean: (value: string): boolean => {
    const normalized = value.toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
    throw new Error(`invalid boolean: "${value}"`);
  },
};

/**
 * Script Properties を読み込んで検証済みのプロパティを返す
 * @returns 検証済みのプロパティをまとめたオブジェクト
 * @throws 未設定・不正なプロパティを見つけた時点で Error を投げる
 */
const loadProperties = () => {
  // getProperties() は全キーを 1 回の呼び出しで原子的に取得する
  // キーごとに getProperty() を呼ぶとラウンドトリップがキー数に比例して増え、
  // 実行中にプロパティが書き換わると読み取り結果の整合性も崩れる
  const properties = PropertiesService.getScriptProperties().getProperties();

  /**
   * プロパティを 1 件読み取ってパースする
   * @param key プロパティのキー
   * @param parser 値のパーサ
   * @param options fallback を渡した場合のみ、未設定を許容して既定値を返す
   * @returns パース済みの値
   * @throws 未設定・不正な場合は Error を投げる
   */
  const readProperty = <T>(
    key: string,
    parser: (value: string) => T,
    options: {fallback?: T} = {}
  ): T => {
    const value = (properties[key] ?? "").trim();
    if (!value.length) {
      if (options.fallback !== undefined) return options.fallback;
      throw new Error(`Required property ${key} is missing.`);
    }
    try {
      return parser(value);
    } catch (e) {
      throw new Error(
        `Property ${key} is invalid: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  };

  return {
    googleJapaneseHolidayCalendarId: readProperty(
      "GOOGLE_JAPANESE_HOLIDAY_CALENDAR_ID",
      propertyParser.asString
    ),
  } as const;
};

export const properties = loadProperties();
