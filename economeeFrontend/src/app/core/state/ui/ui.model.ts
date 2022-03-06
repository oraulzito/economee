export interface Ui {
  id: number | string;
  mobile: boolean;
  rangeDateBalance: RANGE_BALANCE;
  initialDateBalance: Date;
  finalDateBalance: Date;
  screenWidth: number;
  screenHeight: number;
  pageLocation: string;
  url: string;
}

export enum RANGE_BALANCE {
  MONTH = 30 | 31 | 28,
  HALF_MONTH = 15,
  WEEK = 7,
  DAY = 1
}
