import { Notify } from 'react-vant';

export const checkResponse = (res: Record<string, any>) => {
  if (res.type === 1) Notify.show({ message: res.message, type: 'primary' });
};

// 金额验证
export function checkMoney(value: string): boolean {
  const inMoney =
    /(?:^[1-9]([0-9]+)?(?:.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9].[0-9](?:[0-9])?$)/;
  if (inMoney.test(value)) {
    return true;
  } else {
    return false;
  }
}
