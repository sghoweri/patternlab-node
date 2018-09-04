import { loadPolyfills } from './utils/polyfills';

loadPolyfills.then(res => {
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-app');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-controls');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-viewport');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-toggle-layout');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-toggle-theme');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-toggle-info');
  import(/* webpackMode: 'lazy' */ './components/pl-app/pl-header');
  import(/* webpackMode: 'lazy' */ './components/pl-app/pl-modal');
  import(/* webpackMode: 'eager' */ './components/pl-app/pl-search');
});

import './components/layout';
import './components/modal-viewer';
import './components/panels';
import './components/panels-viewer';
import './components/plugin-loader';
import './components/styleguide';

//// Add hook to auto re-render the root component.
if (typeof module.hot === 'object') {
  module.hot.accept(err => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}
