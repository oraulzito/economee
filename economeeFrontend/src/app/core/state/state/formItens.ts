export interface FormItem {
  name: string,
  type: string,
  label: string,
  errorTip: {
    required: string,
    error: string,
  },
  icon: string,
  size: {
    sm?: number | 24,
    md?: number | 24,
    lg?: number | 24,
    xl?: number | 24,
    xxl?: number | 24,
  } | number,
  min?: number,
  max?: number,
  options?: SelectOptions[],
}

export interface SelectOptions {
  label: string,
  value: any,
}

export interface SubmitButton {
  text: '',
}
