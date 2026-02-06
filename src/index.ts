import {create} from "./functions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

/**
 * 入力した祝日情報をもとにBusinessDayオブジェクトを生成する
 * @param holidays 祝日情報の配列
 * @returns BusinessDayオブジェクト
 */
global.create = create;
