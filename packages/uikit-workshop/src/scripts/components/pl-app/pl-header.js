import { define, props } from 'skatejs';
import { h } from 'preact';

// import { ro } from '../../utils';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateHeaderHeight } from '../../actions/app.js';

import { BaseComponent } from './base-component';

@define
export class Header extends BaseComponent {
  static is = 'pl-header';

  constructor(self) {
    self = super(self);
    return self;
  }

  get renderRoot() {
    return this;
  }

  connected() {
    // ro.observe(this);
  }

  // static props = {
  //   _drawerOpened: props.boolean,
  // };

  _stateChanged(state) {
    // this._drawerOpened = state.app.drawerOpened;
    // this.updated();
  }

  // updateSize(contentRect) {
  //   store.dispatch(updateHeaderHeight(contentRect.height));
  // }

  render() {
    // Anything that's related to rendering should be done in here.
    return <div class="c-pl-header" />;
  }
}
