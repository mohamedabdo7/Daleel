export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  type?: string;
  required?: boolean;
  className?: string;
  errMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  subText?: string | React.ReactNode;
  containerClassName?: string;
}
