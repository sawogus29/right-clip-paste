import {
  writeToClipboard,
  readFromClipboard,
  isTextInputElement,
  applyHandler,
} from './utils';

/**
 * utils
 */
const makeHandler = (isPasteToTextInputOn, isRightClipOn) => {
  if (!isPasteToTextInputOn && !isRightClipOn) {
    return null;
  }

  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (isPasteToTextInputOn && isTextInputElement(e.target)) {
      e.target.value = readFromClipboard();
      return;
    }

    if (isRightClipOn) {
      console.log(e.target.innerText);
      writeToClipboard(e.target.innerText);
      return;
    }
  };
};

/**
 * Initialization
 */
const INITIAL_STATE = {
  isRightClipOn: false,
  isHoverEffectOn: false,
  isPasteToTextInputOn: false,
};

let state = { ...INITIAL_STATE };
chrome.storage.local.get(state).then((result) => {
  state = result;
});

/**
 * setter
 */
const setIsRightClipOn = (isRightClipOn, state) => {
  const { isPasteToTextInputOn } = state;

  applyHandler(makeHandler(isPasteToTextInputOn, isRightClipOn));

  return { ...state, isRightClipOn };
};

const setIsHoverEffectOn = (isHoverEffectOn, state) => {
  document.body.dataset['rcp-is-hover-effect-on'] = isHoverEffectOn;

  return { ...state, isHoverEffectOn };
};

const setIsPasteToTextInputOn = (isPasteToTextInputOn, state) => {
  const { isRightClipOn } = state;

  applyHandler(makeHandler(isPasteToTextInputOn, isRightClipOn));

  return { ...state, isPasteToTextInputOn };
};

/**
 * Event Loop
 */
chrome.storage.onChanged.addListener((changes, namespaces) => {
  const KEY_2_SETTER = {
    isRightClipOn: setIsRightClipOn,
    isHoverEffectOn: setIsHoverEffectOn,
    isPasteToTextInputOn: setIsPasteToTextInputOn,
  };

  for (let [key, { _, newValue }] of Object.entries(changes)) {
    state = KEY_2_SETTER[key](newValue, state);
  }
});
