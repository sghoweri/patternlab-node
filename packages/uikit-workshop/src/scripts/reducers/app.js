import {
  UPDATE_DRAWER_STATE,
  UPDATE_DRAWER_HEIGHT,
  UPDATE_APP_HEIGHT,
  UPDATE_DRAWER_ANIMATION_STATE,
  UPDATE_LAYOUT_MODE,
  UPDATE_THEME_MODE,
  UPDATE_VIEWPORT_HEIGHT,
  UPDATE_VIEWPORT_WIDTH,
  UPDATE_HEADER_HEIGHT,
  IS_VIEWALL_PAGE,
} from '../actions/app.js';

const app = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened,
      };
    case UPDATE_LAYOUT_MODE:
      return {
        ...state,
        layoutMode: action.layoutMode,
      };
    case UPDATE_THEME_MODE:
      return {
        ...state,
        themeMode: action.themeMode,
      };
    case UPDATE_DRAWER_HEIGHT:
      return {
        ...state,
        drawerHeight: action.height,
      };
    case UPDATE_DRAWER_ANIMATION_STATE:
      return {
        ...state,
        drawerIsAnimating: action.drawerIsAnimating,
      };
    case UPDATE_VIEWPORT_HEIGHT:
      return {
        ...state,
        viewportHeight: action.height,
      };
    case UPDATE_VIEWPORT_WIDTH:
      return {
        ...state,
        viewportWidth: action.width,
      };
    case UPDATE_HEADER_HEIGHT:
      return {
        ...state,
        headerHeight: action.height,
      };
    case UPDATE_APP_HEIGHT:
      return {
        ...state,
        appHeight: action.height,
      };
    case IS_VIEWALL_PAGE:
      return {
        ...state,
        isViewallPage: action.isViewall,
      };
    default:
      return state;
  }
};

export default app;
