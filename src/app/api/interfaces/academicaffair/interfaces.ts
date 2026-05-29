'use server'

import { JSX } from "react";

export interface Tabb {
    value: string;
    icon: JSX.Element | undefined;
    label: string; 
    disabled: boolean;
  }
export interface Colors {
    buttonColors: ("inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning")[];
  }  
interface ButtonForRow { label: string; onClick: (item:any) => void; icon?: React.ReactNode; disabled?: boolean; color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"; }
export interface Column{ name:string; width?:string; component?:React.ReactNode; componentTitle?:string; contentType?:string; ButtonForRow?:ButtonForRow; }
export interface selectedRadio{ name:string; isSelected:boolean; }
export interface ColumnForFeedbackTable{ name:string; width?:string; contentType?:string; ButtonForRow?:ButtonForRow; isRadio?:boolean; }
export interface variants {
  typography: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | undefined;
}
export interface NavigationTab{ icon?:React.ReactNode; title:string; link:string; }