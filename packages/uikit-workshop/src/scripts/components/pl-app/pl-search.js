import { define, props } from 'skatejs';
import { h } from 'preact';
import $ from 'jquery';
import 'typeahead.js/dist/typeahead.jquery.js';
import Bloodhound from 'typeahead.js/dist/bloodhound.js';
import { urlHandler } from '../../utils';

// This element is connected to the Redux store.
import { store } from '../../store.js';

// These are the actions needed by this element.
import { updateDrawerState } from '../../actions/app.js';

import { BaseComponent } from './base-component';

@define
export class Search extends BaseComponent {
  static is = 'pl-search';

  constructor(self) {
    self = super(self);
    this.data = [];
    this.active = false;
    this.receiveIframeMessage = this.receiveIframeMessage.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onAutocompleted = this.onAutocompleted.bind(this);
    this.toggleFinder = this.toggleFinder.bind(this);
    this.closeFinder = this.closeFinder.bind(this);
    this.openFinder = this.openFinder.bind(this);

    for (const patternType in window.patternPaths) {
      if (window.patternPaths.hasOwnProperty(patternType)) {
        for (const pattern in window.patternPaths[patternType]) {
          if (window.patternPaths[patternType].hasOwnProperty(pattern)) {
            const obj = {};
            obj.patternPartial = patternType + '-' + pattern;
            obj.patternPath = window.patternPaths[patternType][pattern];
            this.data.push(obj);
          }
        }
      }
    }

    return self;
  }

  get renderRoot() {
    return this;
  }

  connected() {
    // instantiate the bloodhound suggestion engine
    this.patterns = new Bloodhound({
      datumTokenizer(d) {
        return Bloodhound.tokenizers.nonword(d.patternPartial);
      },
      queryTokenizer: Bloodhound.tokenizers.nonword,
      limit: 10,
      local: this.data,
    });

    // initialize the bloodhound suggestion engine
    this.patterns.initialize();

    window.addEventListener('message', this.receiveIframeMessage, false);
  }

  rendered() {
    this.inputElement = $(this.querySelector('.pl-c-typeahead__input'));
    this.inputElement
      .typeahead(
        {
          highlight: true,
          classNames: {
            wrapper: 'pl-c-typeahead',
            input: 'pl-c-typeahead__input',
            hint: 'pl-c-typeahead__hint',
            menu: 'pl-c-typeahead__menu',
            dataset: 'pl-c-typeahead__results',
            suggestion: 'pl-c-typeahead__result',
            open: 'is-open',
            cursor: 'has-cursor',
            highlight: 'is-highlightable',
            empty: 'is-empty',
            selectable: 'is-selectable',
          },
        },
        {
          displayKey: 'patternPartial',
          source: this.patterns.ttAdapter(),
        }
      )
      .on('typeahead:selected', this.onSelected)
      .on('typeahead:autocompleted', this.onAutocompleted);
  }

  // static props = {
  //   _drawerOpened: props.boolean,
  // };

  _stateChanged(state) {
    // this._drawerOpened = state.app.drawerOpened;
    // this.isViewallPage = state.app.isViewallPage;
  }

  passPath(item) {
    // update the iframe via the history api handler
    this.closeFinder();
    const obj = JSON.stringify({
      event: 'patternLab.updatePath',
      path: urlHandler.getFileName(item.patternPartial),
    });
    document
      .querySelector('.pl-js-iframe')
      .contentWindow.postMessage(obj, urlHandler.targetOrigin);
  }

  onSelected(e, item) {
    this.passPath(item);
  }

  onAutocompleted(e, item) {
    this.passPath(item);
  }

  toggleFinder() {
    if (!this.active) {
      this.openFinder();
    } else {
      this.closeFinder();
    }
  }

  openFinder() {
    this.active = true;
    this.inputElement.val('');
  }

  closeFinder() {
    this.active = false;
    document.activeElement.blur();
    this.inputElement.val('');
  }

  receiveIframeMessage(event) {
    // does the origin sending the message match the current host? if not dev/null the request
    if (
      window.location.protocol !== 'file:' &&
      event.origin !== window.location.protocol + '//' + window.location.host
    ) {
      return;
    }

    let data = {};
    try {
      data =
        typeof event.data !== 'string' ? event.data : JSON.parse(event.data);
    } catch (e) {
      // @todo: how do we want to handle exceptions here?
    }

    if (data.event !== undefined && data.event === 'patternLab.keyPress') {
      if (data.keyPress === 'ctrl+shift+f') {
        this.toggleFinder();
      }
    }
  }

  render() {
    return (
      <input
        class="pl-c-typeahead__input pl-js-typeahead"
        id="typeahead"
        type="text"
        placeholder="Find Pattern"
        onFocus={() => {
          !this.active ? this.openFinder : '';
        }}
        onBlur={() => {
          this.closeFinder;
        }}
      />
    );
  }
}
