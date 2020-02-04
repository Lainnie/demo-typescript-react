import { ajax as rxjsAjax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';

function enhanceConfig(config: AjaxRequest): AjaxRequest {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (currentUser && currentUser.client_session) {
    const newConfig = {
      ...config,
      headers: {
        'Content-Type':
          config.method && config.method.toLowerCase() === 'post'
            ? 'application/json'
            : undefined,
        ...config.headers,
        'Client-Session': currentUser.client_session,
      },
    };
    return newConfig;
  }
  return config;
}

export const ajax = (config: AjaxRequest) => rxjsAjax(enhanceConfig(config));

export interface CustomAjaxResponse<D> extends AjaxResponse {
  response: D;
}
