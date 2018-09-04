import { define, props } from 'skatejs';
import { h } from 'preact';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateDrawerState } from '../../actions/app.js';

import { BaseComponent } from './base-component';

@define
export class Button extends BaseComponent {
  static is = 'pl-info-toggle';

  constructor(self) {
    self = super(self);
    return self;
  }

  get renderRoot() {
    return this;
  }

  static props = {
    _drawerOpened: props.boolean,
  };

  _stateChanged(state) {
    this._drawerOpened = state.app.drawerOpened;
    this.isViewallPage = state.app.isViewallPage;
  }

  render({ _drawerOpened, isViewallPage }) {
    return (
      <button
        class="pl-c-tools__action"
        onClick={_ => store.dispatch(updateDrawerState(!_drawerOpened))}
      >
        {_drawerOpened
          ? `Hide ${isViewallPage ? 'all ' : ''}Pattern Info`
          : `Show ${isViewallPage ? 'all ' : ''}Pattern Info`}
      </button>
    );
  }
}
