import * as React from 'react';
import { RouteComponentProps } from "react-router";

export type RouteComponentEnhancer<NewProps = {}> = (routeComponentProps: RouteComponentProps) => NewProps;

export const enhanceRouteComponent = (...enhancers: RouteComponentEnhancer[]) => {
  return (Component: any) => {
    return (routeComponentProps: RouteComponentProps) => {
      return (
        <Component
          {...(enhancers && enhancers.reduce((res, enhancer) => ({
            ...res,
            ...enhancer(routeComponentProps)
          }), {}))}
        />
      );
    }
  }
}
