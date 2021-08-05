export interface Ui {
  id: number | string;
  mobile: boolean;
  screenWidth: number;
  screenHeight: number;
  pageLocation: string;
}

export function createUi(params: Partial<Ui>) {
  return {

  } as Ui;
}
