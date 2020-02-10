/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

let navigator: any;

export function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef;

  if (!!navigator) {
    for (const action of navQueue) {
      navigator.dispatch(action);
    }
    navQueue = [];
  }
}

let navQueue: any[] = [];

export function navigate(action: any) {
  if (navigator) {
    navigator.dispatch(action);
  } else {
    navQueue.push(action);
  }
}
