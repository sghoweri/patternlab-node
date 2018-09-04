import { define, props } from 'skatejs';
import { h } from 'preact';

// import { ro } from '../../utils';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateViewportHeight } from '../../actions/app.js';

import { BaseComponent } from './base-component';

@define
export class Viewport extends BaseComponent {
  static is = 'pl-viewport';

  constructor(self) {
    self = super(self);
    this.setViewportHeightState = this.setViewportHeightState.bind(this);
    this.setViewportHeightProps = this.setViewportHeightProps.bind(this);
    return self;
  }

  get renderRoot() {
    return this;
  }

  connected() {
    this.setViewportHeightState(true);

    window.addEventListener('resize', this.setViewportHeightState);
    window.addEventListener('orientationchange', this.setViewportHeightState);
  }

  setViewportHeightState(skipCheck = false) {
    const currentHeight = this.getBoundingClientRect().height;
    if (this.viewportHeight !== currentHeight || skipCheck === true) {
      this.viewportHeight = currentHeight;
      this.setViewportHeightProps();
      store.dispatch(updateViewportHeight(currentHeight));
    }
  }

  setViewportHeightProps() {
    document.documentElement.style.setProperty(
      '--viewport-height',
      `${this.viewportHeight}px`
    );
  }

  _stateChanged(state) {
    this.drawerIsAnimating = state.app.drawerIsAnimating;
    this.viewportHeight = state.app.viewportHeight;
    this.viewportWidth = state.app.viewportWidth;

    // console.log(this.viewportWidth);

    setTimeout(() => {
      this.setViewportHeightState();
    }, 20);

    if (this.drawerIsAnimating) {
      document.documentElement.classList.add('is-resizing');
      this.classList.add('is-animating');
    } else {
      document.documentElement.classList.remove('is-resizing');
      this.classList.remove('is-animating');
    }
  }
}
