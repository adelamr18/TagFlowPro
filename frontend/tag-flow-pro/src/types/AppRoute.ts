import { JSX } from "react";

export interface AppRoute {
  path: string;
  layout: string;
  component: JSX.Element;
  name?: string;
}
