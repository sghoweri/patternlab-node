import { define, props } from 'skatejs';
import { h } from 'preact';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateAppHeight } from '../../actions/app.js';

import { BaseComponent } from './base-component';


@define
export class App extends BaseComponent {
  static is = 'pl-app';

  constructor(self) {
    self = super(self);
    this.updateAppHeight = this.updateAppHeight.bind(this);
    return self;
  }

  static props = {
    layoutMode: props.string,
    themeMode: props.string,
  };

  connected() {
    const state = store.getState();
    this.layoutMode = state.app.layoutMode;
    this.themeMode = state.app.themeMode;

   

    this.updateAppHeight();

    window.addEventListener('resize', this.updateAppHeight, false);
    window.addEventListener('orientationchange', this.updateAppHeight, false);
  }

  get renderRoot() {
    return this;
  }

  updateAppHeight() {
    console.log(window.innerHeight);
    console.log(window.outerHeight);

    // this.setAttribute('style', `--screen-height: ${window.innerHeight}px`);
    document.body.setAttribute('style', `--screen-height: ${window.innerHeight}px`);
  }

  _stateChanged(state) {
    this.layoutMode = state.app.layoutMode;
    this.themeMode = state.app.themeMode;
  }

  render() {
    this.className = `pl-c-body--theme-${this.layoutMode} pl-c-body--theme-${
      this.themeMode
    }`;
  }
}


// var onResize = function () {
//   //var docHeight = window.innerHeight;
//   var docHeight = $(window).outerHeight();
//   $('.hero').css({ height: docHeight });
//   $('.hero').html(docHeight);
// };
// $(window).on('resize', onResize);
// onResize();