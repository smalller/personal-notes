export type CallBack = (bool: boolean) => boolean;

export interface FormItemInfo {
  label: string;
  prop: string;
  validate(): void;
}
