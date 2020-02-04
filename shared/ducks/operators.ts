import { filter } from 'rxjs/operators';
import { Action } from 'redux';
import { Observable } from 'rxjs';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── OF FEATURE AND TYPE ────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const keyHasType = (type: string, key:string|Function) => {
  return type === key || (typeof key === 'function' && type === key.toString());
};

interface ReusableAction {
  feature: string,
}

/**
 * ofFeatureAndType - Custom operator
 * @param featureName - Only action holding this featureName as 'feature' will pass
 * @param keys - types that must trigger the epic
 */
export function ofFeatureAndType<T extends Action&ReusableAction, R extends T = T, K extends R['type'] = R['type']>(featureName: string, ...keys: K[]) {
  return function(source: Observable<T>): Observable<T> {
    return source.pipe(
      // type & feature from action that is currently passing and being tested
      filter(({ type, feature }) => {
        // Feature check SUCCESS
        if (feature && featureName && feature === featureName) {
          const len = keys.length;
          if (len === 1) {
            return keyHasType(type, keys[0]);
          } else {
            for (let i = 0; i < len; i++) {
              if (keyHasType(type, keys[i])) {
                return true;
              }
            }
          }
          return false;
        }
        // Feature check FAILURE
        return false;
      })
    );
  }
};

