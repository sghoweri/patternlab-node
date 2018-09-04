export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_HEIGHT = 'UPDATE_DRAWER_HEIGHT';

export const UPDATE_VIEWPORT_HEIGHT = 'UPDATE_VIEWPORT_HEIGHT';
export const UPDATE_VIEWPORT_WIDTH = 'UPDATE_VIEWPORT_WIDTH';

export const UPDATE_DRAWER_ANIMATION_STATE = 'UPDATE_DRAWER_ANIMATION_STATE';
export const UPDATE_APP_HEIGHT = 'UPDATE_APP_HEIGHT';
export const UPDATE_HEADER_HEIGHT = 'UPDATE_HEADER_HEIGHT';
export const UPDATE_LAYOUT_MODE = 'UPDATE_LAYOUT_MODE';
export const UPDATE_THEME_MODE = 'UPDATE_THEME_MODE';
export const IS_VIEWALL_PAGE = 'IS_VIEWALL_PAGE';

export const updateDrawerState = opened => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened,
    });
  }
};

export const updateLayoutMode = layoutMode => (dispatch, getState) => {
  if (getState().app.layoutMode !== layoutMode) {
    dispatch({
      type: UPDATE_LAYOUT_MODE,
      layoutMode,
    });
  }
};

export const updateThemeMode = themeMode => (dispatch, getState) => {
  if (getState().app.themeMode !== themeMode) {
    dispatch({
      type: UPDATE_THEME_MODE,
      themeMode,
    });
  }
};

export const updateDrawerAnimationState = drawerIsAnimating => (dispatch, getState) => {
  if (getState().app.drawerIsAnimating !== drawerIsAnimating) {
    dispatch({
      type: UPDATE_DRAWER_ANIMATION_STATE,
      drawerIsAnimating,
    });
  }
};

export const updateDrawerHeight = height => (dispatch, getState) => {
  if (getState().app.drawerHeight !== height) {
    dispatch({
      type: UPDATE_DRAWER_HEIGHT,
      height,
    });
  }
};

export const updateAppHeight = height => (dispatch, getState) => {
  if (getState().app.appHeight !== height) {
    dispatch({
      type: UPDATE_APP_HEIGHT,
      height,
    });
  }
};

export const updateViewportHeight = height => (dispatch, getState) => {
  if (getState().app.viewportHeight !== height) {
    dispatch({
      type: UPDATE_VIEWPORT_HEIGHT,
      height,
    });
  }
};

export const updateViewportWidth = width => (dispatch, getState) => {
  if (getState().app.viewportWidth !== width) {
    dispatch({
      type: UPDATE_VIEWPORT_WIDTH,
      width,
    });
  }
};

export const updateHeaderHeight = height => (dispatch, getState) => {
  if (getState().app.headerHeight !== height) {
    dispatch({
      type: UPDATE_HEADER_HEIGHT,
      height,
    });
  }
};

export const isViewallPage = isViewall => (dispatch, getState) => {
  if (getState().app.isViewallPage !== isViewall) {
    dispatch({
      type: IS_VIEWALL_PAGE,
      isViewall,
    });
  }
};
