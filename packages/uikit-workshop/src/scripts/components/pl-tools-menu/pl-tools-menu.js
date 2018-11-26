import { define, props } from 'skatejs';
import { BaseComponent } from '../base-component.js';
import { urlHandler, patternName } from '../../utils';
import { h } from 'preact';
import NewTabIcon from '../../../icons/new-tab.svg';
import HelpIcon from '../../../icons/help.svg';
import SettingsIcon from '../../../icons/settings.svg';

@define
class ToolsMenu extends BaseComponent {
  static is = 'pl-tools-menu';

  _stateChanged(state) {}

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  connecting() {
    const { ishControlsHide } = window.ishControls;
    this.ishControlsHide = ishControlsHide;
  }

  handleClick(e) {
    const elem = e.target.closest('.pl-js-acc-handle');
    const panel = elem.nextSibling;

    // Activate selected panel
    elem.classList.toggle('pl-is-active');
    panel.classList.toggle('pl-is-active');
  }

  render() {
    const patternPath = urlHandler.getFileName(patternName);

    return (
      <div class="pl-c-tools">
        <button
          class="pl-c-tools__toggle pl-js-acc-handle"
          title="Tools"
          onClick={this.handleClick}
        >
          <SettingsIcon
            width={18}
            height={18}
            viewBox="0 0 24 24"
            className="pl-c-tools__toggle-icon"
            fill="currentColor"
          />
        </button>
        <ul class="pl-c-tools__list pl-js-acc-panel">
          <li class="pl-c-tools__item">
            <pl-toggle-info />
          </li>
          <li class="pl-c-tools__item">
            <pl-toggle-layout text="Switch Layout" />
          </li>
          <li class="pl-c-tools__item">
            <pl-toggle-theme />
          </li>

          {!this.ishControlsHide['views-new'] && (
            <li class="pl-c-tools__item">
              <a
                href={patternPath}
                class="pl-c-tools__action pl-js-open-new-window"
                target="_blank"
              >
                <span class="pl-c-tools__action-text">Open In New Tab</span>
                <span class="pl-c-tools__action-icon">
                  <NewTabIcon
                    height={20}
                    width={20}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  />
                </span>
              </a>
            </li>
          )}

          {!this.ishControlsHide['tools-docs'] && (
            <li class="pl-c-tools__item">
              <a
                href="http://patternlab.io/docs/"
                class="pl-c-tools__action"
                target="_blank"
              >
                <span class="pl-c-tools__action-text">Pattern Lab Docs</span>
                <span class="pl-c-tools__action-icon">
                  <HelpIcon
                    height={20}
                    width={20}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  />
                </span>
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
