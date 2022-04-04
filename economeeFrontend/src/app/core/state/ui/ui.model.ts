export interface Ui {
  id: number | string;
  mobile: boolean;
  rangeDateBalance: RANGE_BALANCE;
  initialDateBalance: string;
  finalDateBalance: string;
  screenWidth: number;
  screenHeight: number;
  pageLocation: string;
  actualUrl: string;
}

export enum RANGE_BALANCE {
  MONTH = 30 | 31 | 28,
  HALF_MONTH = 15,
  WEEK = 7,
  DAY = 1
}
