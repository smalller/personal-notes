export type Validate = () => void;

export interface FormItemInfo {
  label: string;
  prop: string;
  errMsg: string;
  validate(): Validate;
}
