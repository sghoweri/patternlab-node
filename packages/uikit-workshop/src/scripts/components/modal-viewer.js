/** @jsx h */

const installCE = require('document-register-element/pony');
installCE(global, 'force');

import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import { h } from 'preact';
import { css, urlHandler, DataSaver } from '../utils';

export class ModalViewer extends withComponent(withPreact()) {
  static props = {
    active: props.boolean,
  };

  // initial setup stuff
  constructor(self) {
    self = super(self);
    this.switchText = true;
    this.template = 'info';

    this.previouslyRenderedPattern = ''; // Remember the last pattern rendered so subsequently opening / closing the panel won't have to re-render every time.
    this.patternData = {};
    this.targetOrigin =
      window.location.protocol === 'file:'
        ? '*'
        : window.location.protocol + '//' + window.location.host;

    this.activeClass = 'pl-is-active';

    this.receiveIframeMessage = this.receiveIframeMessage.bind(this); // fix bindings to document / window events so "this" works properly
    this.handleModalCloseBtn = this.handleModalCloseBtn.bind(this);
    this.handleModalResizer = this.handleModalResizer.bind(this);

    return self;
  }

  // for the time being, always render to the light DOM
  get renderRoot() {
    return this;
  }

  // // initial bootup work relating to event listeners mostly
  connected() {
    const self = this;
    window.addEventListener('message', this.receiveIframeMessage);

    this.patternInfoToggle = document.querySelector(
      '.pl-js-pattern-info-toggle'
    );
    this.iframeElem = document.querySelector('.pl-js-iframe');
    this.viewportComponent = document.querySelector('.pl-js-viewport');

    // add the info/code panel onclick handler
    this.patternInfoToggle.addEventListener('click', function(e) {
      if (self.props.active) {
        self.removeAttribute('active');
        self.close();
      } else {
        self.setAttribute('active', '');
        self.open();
      }
    });

    // see if the modal is already active, if so update attributes as appropriate
    if (DataSaver.findValue('modalActive') === 'true') {
      this.setAttribute('active', '');
      this.patternInfoToggle.innerHTML = 'Hide Pattern Info';
    }

    // review the query strings in case there is something the modal viewer is supposed to handle by default
    const queryStringVars = urlHandler.getRequestVars();

    // show the modal if code or annotations are called via query string
    if (
      queryStringVars.view !== undefined &&
      (queryStringVars.view === 'code' ||
        queryStringVars.view === 'annotations' ||
        queryStringVars.view === 'c' ||
        queryStringVars.view === 'a')
    ) {
      this.open();
    }
  }

  rendered() {
    this.modalComponent = document.querySelector('.pl-c-modal');

    if (!this.modalContent) {
      this.queryPattern();
    }
  }

  handleModalCloseBtn() {
    this.sendMessage({ event: 'patternLab.annotationsHighlightHide' }); // hide any open annotations
    this.close(); // hide the viewer
  }

  // toggle the modal window open and closed
  toggle() {
    if (!this.props.active) {
      this.open();
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
      this.sendMessage({
        event: 'patternLab.annotationsHighlightHide',
      });
      this.close();
    }
  }

  // open the modal window
  open() {
    this.patternInfoToggle.innerHTML = 'Hide Pattern Info';
    DataSaver.updateValue('modalActive', 'true'); // note it's turned on in the viewer
    this.setAttribute('active', '');
  }

  // close the modal window
  close() {
    this.patternInfoToggle.innerHTML = 'Show Pattern Info';
    DataSaver.updateValue('modalActive', 'false');
    this.removeAttribute('active');

    this.modalComponent.style.cssText = ''; // Clear out inline height CSS previously added

    // tell the styleguide to close
    this.sendMessage({ event: 'patternLab.patternModalClose' });
  }

  sendMessage(eventData) {
    const obj = JSON.stringify(eventData);
    this.iframeElem.contentWindow.postMessage(obj, this.targetOrigin);
  }

  // hide the modal window
  hide() {
    this.removeAttribute('active');
  }

  /**
   * refresh the modal if a new pattern is loaded and the modal is active
   * @param  {Object}       the patternData sent back from the query
   * @param  {Boolean}      if the refresh is of a view-all view and the content should be sent back
   * @param  {Boolean}      if the text in the dropdown should be switched
   */
  refresh(patternData, iframePassback, switchText) {
    // if this is a styleguide view close the modal
    if (iframePassback) {
      this.hide();
    }

    // gather the data that will fill the modal window
    this.querySelector('panels-viewer').gatherPanels(
      patternData,
      iframePassback,
      switchText
    );
  }

  /**
   * slides the modal window into or out of view
   * @param  {Integer}      where the modal window should be slide to
   */
  slide(pos) {
    const headerHeight = document
      .querySelector('.pl-js-header')
      .getBoundingClientRect().height;

    if (this.modalComponent.classList.contains(this.activeClass)) {
      this.modalComponent.classList.remove(this.activeClass);
      this.modalComponent.removeAttribute('height');
      this.viewportComponent.setAttribute(
        'height',
        `calc(100vh - ${headerHeight}px);`
      );
    } else {
      this.modalComponent.classList.add(this.activeClass);
    }
  }

  /**
   * slides the modal window to a particular annotation
   * @param  {Integer}      the number for the element that should be highlighted
   */
  slideToAnnotation(pos) {
    const self = this;

    // remove active class
    const els = document.querySelectorAll('.pl-js-annotations li');
    for (let i = 0; i < els.length; ++i) {
      els[i].classList.remove(self.activeClass);
    }

    // add active class to called element and scroll to it
    for (let i = 0; i < els.length; ++i) {
      if (i + 1 === pos) {
        els[i].classList.add(self.activeClass);
        // $('.pl-js-pattern-info').animate(
        //   {
        //     scrollTop: els[i].offsetTop - 10,
        //   },
        //   600
        // );
      }
    }
  }

  /**
   * ask the pattern for info so we can open the modal window and populate it
   * @param  {Boolean}      if the dropdown text should be changed
   */
  queryPattern(switchText) {
    // note that the modal is active and set switchText
    if (switchText === undefined || switchText) {
      this.switchText = true;
    }

    // send a message to the pattern
    this.sendMessage({
      event: 'patternLab.patternQuery',
      switchText: this.switchText,
    });
  }

  /**
   * toggle the comment pop-up based on a user clicking on the pattern
   * based on the great MDN docs at https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage
   * @param  {Object}      event info
   */
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
    } catch (e) {}

    if (data.event !== undefined && data.event === 'patternLab.pageLoad') {
      if (
        !this.props.active &&
        data.patternpartial !== undefined &&
        data.patternpartial.indexOf('viewall-') === 0 &&
        window.config.defaultShowPatternInfo !== undefined &&
        window.config.defaultShowPatternInfo
      ) {
        this.queryPattern(false);
      } else if (this.props.active) {
        this.queryPattern();
      }
    } else if (
      data.event !== undefined &&
      data.event === 'patternLab.patternQueryInfo'
    ) {
      // refresh the modal if a new pattern is loaded and the modal is active

      if (
        !this.panelRendered ||
        this.previouslyRenderedPattern !== data.patternData.patternPartial
      ) {
        this.refresh(
          data.patternData ? data.patternData : window.patternData,
          data.iframePassback,
          data.switchText
        );

        this.panelRendered = true;
        this.previouslyRenderedPattern = data.patternData.patternPartial;
      }
    } else if (
      data.event !== undefined &&
      data.event === 'patternLab.annotationNumberClicked'
    ) {
      // slide to a given annoation
      this.slideToAnnotation(data.displayNumber);
    }
  }

  /**
   * Pattern panel resizer
   * 1) Add mousedown event listener to the modal resizer tab
   * 2) Display block on the modal cover when the panel is being dragged so fast
   * drags can occur.
   * 3) Create mousemove event on the cover since it spans the entire screen and
   * the mouse can be dragged into it without losing resizing
   * 4) Find the new panel height by taking the window height and subtracting the
   * Y-position within the modal cover. Set modal height to this.
   * 5) Add mouseup event to the body so that when drag is released, the modal
   * stops resizing and modal cover doesn't display anymore.
   */
  handleModalResizer() {
    const viewportComponent = this.viewportComponent;
    const modalComponent = this.modalComponent;

    const modalCover = document.querySelector('.pl-js-modal-cover');

    modalCover.setAttribute('style', 'display: block;');

    function modalCoverMotion(event) {
      const panelHeight = window.innerHeight - event.clientY + 7; // 1/2 the height of the UI being dragged. @todo: make sure this 7px is calculated
      modalComponent.setAttribute('style', `height: ${panelHeight}px;`);
    }

    modalCover.addEventListener('mousemove', modalCoverMotion);

    function modalCoverReset() {
      modalCover.removeEventListener('mousemove', modalCoverMotion, false);
      modalCover.setAttribute('style', 'display: none;');

      document.body.removeEventListener('mouseup', modalCoverReset, false);
    }

    document.body.addEventListener('mouseup', modalCoverReset);
  }

  render({ props }) {
    const classes = css('pl-c-modal', props.active ? this.activeClass : '');

    return (
      <div className={classes}>
        <div class="pl-c-modal__toolbar">
          <div
            class="pl-c-modal__resizer pl-js-modal-resizer"
            onMouseDown={this.handleModalResizer}
          />
          <button
            class="pl-c-modal__close-btn pl-js-modal-close-btn"
            title="Hide pattern info"
            onClick={this.handleModalCloseBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              class="pl-c-modal__close-btn-icon"
            >
              <title>Close</title>
              <path
                fill="currentColor"
                d="M11.8905,9.6405 L11.8905,9.6405 L8.25,6 L11.8905,2.3595 L11.8905,2.3595 C11.9295,2.3205 11.958,2.27475 11.976,2.226 C12.0255,2.0925 11.997,1.9365 11.8905,1.82925 L10.17075,0.1095 C10.0635,0.00225 9.9075,-0.02625 9.774,0.024 C9.72525,0.042 9.6795,0.0705 9.6405,0.1095 L9.6405,0.1095 L6,3.75 L2.3595,0.1095 L2.3595,0.1095 C2.3205,0.0705 2.27475,0.042 2.226,0.024 C2.0925,-0.0255 1.9365,0.00225 1.82925,0.1095 L0.1095,1.82925 C0.00225,1.9365 -0.02625,2.0925 0.024,2.226 C0.042,2.27475 0.0705,2.3205 0.1095,2.3595 L0.1095,2.3595 L3.75,6 L0.1095,9.6405 L0.1095,9.6405 C0.0705,9.6795 0.042,9.72525 0.024,9.774 C-0.0255,9.9075 0.00225,10.0635 0.1095,10.17075 L1.82925,11.8905 C1.9365,11.99775 2.0925,12.02625 2.226,11.976 C2.27475,11.958 2.3205,11.9295 2.3595,11.8905 L2.3595,11.8905 L6,8.25 L9.6405,11.8905 L9.6405,11.8905 C9.6795,11.9295 9.72525,11.958 9.774,11.976 C9.9075,12.0255 10.0635,11.99775 10.17075,11.8905 L11.8905,10.17075 C11.99775,10.0635 12.02625,9.9075 11.976,9.774 C11.958,9.72525 11.9295,9.6795 11.8905,9.6405 L11.8905,9.6405 Z"
              />
            </svg>
          </button>
        </div>

        <panels-viewer />
      </div>
    );
  }
}

customElements.define('modal-viewer', ModalViewer);
