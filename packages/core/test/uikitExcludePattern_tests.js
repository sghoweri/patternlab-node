'use strict';

const tap = require('tap');

const uikitExcludePattern = require('../src/lib/uikitExcludePattern');

tap.test(
  'uikitExcludePattern - returns false when uikit has no excluded states',
  test => {
    //arrange
    const uikit = { excludedPatternStates: [] };
    const pattern = { patternState: 'complete' };

    //act
    const result = uikitExcludePattern(pattern, uikit);

    //assert
    test.false(result);
    test.end();
  }
);

tap.test(
  'uikitExcludePattern - returns false pattern does not have same state as uikit exclusions',
  test => {
    //arrange
    const uikit = { excludedPatternStates: ['complete'] };
    const pattern = { patternState: 'inprogress' };

    //act
    const result = uikitExcludePattern(pattern, uikit);

    //assert
    test.false(result);
    test.end();
  }
);

tap.test(
  'uikitExcludePattern - returns true when uikit has same state as pattern',
  test => {
    //arrange
    const uikit = { excludedPatternStates: ['inreview', 'complete'] };
    const pattern = { patternState: 'complete' };

    //act
    const result = uikitExcludePattern(pattern, uikit);

    //assert
    test.true(result);
    test.end();
  }
);
