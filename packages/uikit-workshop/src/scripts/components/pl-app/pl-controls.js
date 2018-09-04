import { define, props } from 'skatejs';
import { h } from 'preact';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateViewportWidth } from '../../actions/app.js';

import { BaseComponent } from './base-component';

@define
export class Controls extends BaseComponent {
  static is = 'pl-controls';

  constructor(self) {
    self = super(self);

    this.bodySize =
      window.config.ishFontSize !== undefined
        ? parseInt(window.config.ishFontSize, 10)
        : parseInt(
            window
              .getComputedStyle(document.body, null)
              .getPropertyValue('font-size'),
            10
          );
    this.state = {};

    this.minViewportWidth = 240;
    this.maxViewportWidth = 2600;

    //set minimum and maximum viewport based on confg
    if (window.config.ishMinimum !== undefined) {
      this.minViewportWidth = parseInt(window.config.ishMinimum, 10); //Minimum Size for Viewport
    }
    if (window.config.ishMaximum !== undefined) {
      this.maxViewportWidth = parseInt(window.config.ishMaximum, 10); //Maxiumum Size for Viewport
    }

    //alternatively, use the ishViewportRange object
    if (window.config.ishViewportRange !== undefined) {
      this.minViewportWidth = window.config.ishViewportRange.s[0];
      this.maxViewportWidth = window.config.ishViewportRange.l[1];
    }

    //if both are set, then let's use the larger one.
    if (window.config.ishViewportRange && window.config.ishMaximum) {
      const largeRange = parseInt(window.config.ishViewportRange.l[1], 10);
      const ishMaximum = parseInt(window.config.ishMaximum, 10);
      this.maxViewportWidth = largeRange > ishMaximum ? largeRange : ishMaximum;
    }

    return self;
  }

  connected() {
    const state = store.getState();
    const initialValue = state.app.viewportWidth || this.minViewportWidth;

    if (initialValue) {
      this.updateViewportSize(initialValue, 'px');
    }
  }

  get renderRoot() {
    return this;
  }

  static props = {
    viewportWidth: props.number,
    inputValuePx: props.number,
  };

  _stateChanged(state) {
    this.inputValuePx = state.app.viewportWidth;

    if (this.inputValuePx !== this.state.inputValuePx) {
      this.updateViewportSize(this.inputValuePx, 'px');
    }
  }

  onKeyDown(unit, e) {
    const inputTarget = this.setInputTarget(unit);
    let multiplier = 1;

    if (e.shiftKey) {
      multiplier = 10;
    } else if (e.altKey) {
      multiplier = 0.1;
    }

    const initialValue = this.state[inputTarget]; // current viewport width before factoring in changes via keyboard 

    if (e.keyCode === 38) {
      this.updateViewportSize(initialValue + multiplier, unit);
    } else if (e.keyCode === 40) {
      this.updateViewportSize(initialValue + multiplier * -1, unit);
    } else if (e.keyCode === 13) {
      this.updateViewportSize(initialValue, unit);
      e.target.blur();
    }
  }

  setInputTarget(unit, e) {
    let inputTarget;
    if (unit === 'px') {
      inputTarget = 'inputValuePx';
    } else {
      inputTarget = 'inputValueEm';
    }
    return inputTarget;
  }

  onInput(unit, e) {
    // this.updateViewportSize(e.target.value, unit);
  }

  onChange(unit, e) {
    this.updateViewportSize(e.target.value, unit);
  }

  onBlur(unit, e) {
    const value = this.normalizeViewportWidth(e.target.value, unit);
    this.updateViewportSize(value, unit);
  }

  roundToNearestDecimal(number) {
    return parseFloat(Number.parseFloat(number).toFixed(1));
  }

  normalizeViewportWidth(number, unit) {
    let normalizedValue = number;

    if (unit !== 'px') {
      normalizedValue = normalizedValue * this.bodySize;

      if (Number.isNaN(normalizedValue)) {
        return this.minViewportWidth / this.bodySize;
      } else if (normalizedValue <= this.minViewportWidth) {
        return this.minViewportWidth / this.bodySize;
      } else if (normalizedValue >= this.maxViewportWidth) {
        return this.maxViewportWidth / this.bodySize;
      } else {
        return this.roundToNearestDecimal(normalizedValue / this.bodySize);
      }
    } else {
      if (Number.isNaN(normalizedValue)) {
        return this.minViewportWidth;
      } else if (normalizedValue <= this.minViewportWidth) {
        return this.minViewportWidth;
      } else if (normalizedValue >= this.maxViewportWidth) {
        return this.maxViewportWidth;
      } else {
        return this.roundToNearestDecimal(normalizedValue);
      }
    }

    
  }

  isValidValue(number, unit) {
    let normalizedValue = number;

    if (unit !== 'px') {
      normalizedValue = normalizedValue * this.bodySize;
    }
    
    if (
      !Number.isNaN(normalizedValue) &&
      normalizedValue >= this.minViewportWidth &&
      normalizedValue <= this.maxViewportWidth
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateViewportSize(value, unit) {
    const inputTarget = this.setInputTarget(unit);

    if (this.isValidValue(value, unit)) {
      if (unit === 'em') {
        this.setState({ [inputTarget]: this.roundToNearestDecimal(value) });
        this.updateSizeReading(this.state[inputTarget], unit);
      } else {
        this.setState({ [inputTarget]: this.roundToNearestDecimal(value) });
        this.updateSizeReading(this.state[inputTarget], unit);
      }
    } else {
      console.log(value);
    }
  }

  // Update Pixel and Em input values
  //'size' is the input number
  //'unit' is the type of unit: either px or em. Default is px. Accepted values are 'px' and 'em'
  updateSizeReading(size, unit) {
    let emSize, pxSize;

    if (unit === 'em') {
      emSize = size;
      pxSize = Math.floor(size * this.bodySize);
    } else {
      pxSize = size;
      emSize = size / this.bodySize;
    }

    if (this.state.inputValuePx !== pxSize) {
      this.setState({ inputValuePx: this.roundToNearestDecimal(pxSize) });
    }

    if (this.state.inputValueEm !== emSize) {
      this.setState({ inputValueEm: this.roundToNearestDecimal(emSize) });
    }

    store.dispatch(updateViewportWidth(this.state.inputValuePx));
  }

  render() {
    return (
      <div class="pl-c-controls pl-js-controls">
        <form class="pl-c-viewport-size" method="post" action="#">
          <input
            type="text"
            class="pl-c-viewport-size__input"
            id="pl-size-px"
            value={this.state['inputValuePx'] ? this.state['inputValuePx'] : ''}
            onInput={this.onInput.bind(this, 'px')}
            onChange={this.onChange.bind(this, 'px')}
            onKeyDown={this.onKeyDown.bind(this, 'px')}
            onBlur={this.onBlur.bind(this, 'px')}
          />
          <label for="pl-size-px" class="pl-c-viewport-size__label">
            px /
          </label>
          <input
            type="text"
            class="pl-c-viewport-size__input"
            id="pl-size-em"
            value={this.state.inputValueEm ? this.state.inputValueEm : ''}
            onInput={this.onInput.bind(this, 'em')}
            onChange={this.onChange.bind(this, 'em')}
            onKeyDown={this.onKeyDown.bind(this, 'em')}
            onBlur={this.onBlur.bind(this, 'em')}
          />
          <label for="pl-size-em" class="pl-c-viewport-size__label">
            em
          </label>
        </form>
      </div>
    );
  }
}
