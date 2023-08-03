import { ButtonHTMLAttributes } from 'react';
// import React from 'react';

/* eslint-disable-next-line */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return <button {...props} className="bg-slate-900 text-cyan-900" />;
}

export default Button;
