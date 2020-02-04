import * as React from 'react';
import * as H from 'history';
import { StaticContext, match } from 'react-router';
import { getSearchParams } from './getSearchParams';
import { RouteComponentEnhancer } from './enhanceRouteComponent';

export interface CustomLocation<SearchParams, State> extends H.Location<State> {
  searchParams: SearchParams;
}

export interface CustomRouteComponentProps<
  SearchParams = {},
  MatchParams extends { [K in keyof MatchParams]?: string } = {},
  Context extends StaticContext = StaticContext,
  State = H.LocationState
> {
  history: H.History;
  location: CustomLocation<SearchParams, State>;
  match: match<MatchParams>;
  staticContext?: Context;
}

export function getCustomRouteComponentProps<P extends CustomRouteComponentProps<SP,MP,C,S>,SP={},MP={},C={},S={}>(props: P) {
  return {
    history: props.history,
    location: props.location,
    match: props.match,
    staticContext: props.staticContext,
  };
}

export const withSearchParams: RouteComponentEnhancer = ({
  location,
  ...rest
}) => ({
  location: {
    ...location,
    searchParams: getSearchParams(location.search),
  },
  ...rest,
});
