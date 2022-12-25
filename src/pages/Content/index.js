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
      readFromClipboard().then((text) => {
        e.target.value = text;
      });
      return;
    }

    if (isRightClipOn) {
      console.log(e.target.innerText);
      writeToClipboard(e.target.innerText);
      return;
    }
  };
};

const applyRightClickHandler = (isPasteToTextInputOn, isRightClipOn) => {
  applyHandler(
    'contextmenu',
    makeHandler(isPasteToTextInputOn, isRightClipOn),
    { capture: true }
  );
};

/**
 * setter
 */
const setIsRightClipOn = (isRightClipOn, state) => {
  const { isPasteToTextInputOn } = state;

  applyRightClickHandler(isPasteToTextInputOn, isRightClipOn);

  return { ...state, isRightClipOn };
};

const setIsHoverEffectOn = (isHoverEffectOn, state) => {
  document.body.dataset.rcpIsHoverEffectOn = isHoverEffectOn;

  return { ...state, isHoverEffectOn };
};

const setIsPasteToTextInputOn = (isPasteToTextInputOn, state) => {
  const { isRightClipOn } = state;

  applyRightClickHandler(isPasteToTextInputOn, isRightClipOn);

  return { ...state, isPasteToTextInputOn };
};

const KEY_2_SETTER = {
  isRightClipOn: setIsRightClipOn,
  isHoverEffectOn: setIsHoverEffectOn,
  isPasteToTextInputOn: setIsPasteToTextInputOn,
};

const setNewState = (newState) => {
  for (let [key, newValue] of Object.entries(newState)) {
    state = KEY_2_SETTER[key](newValue, state);
  }
};

/**
 * Initialization
 */
const INITIAL_STATE = {
  isRightClipOn: true,
  isHoverEffectOn: true,
  isPasteToTextInputOn: true,
};

let state = { ...INITIAL_STATE };

chrome.storage.local.get(state).then((newState) => {
  setNewState(newState);
});

/**
 * Event Loop
 */
chrome.storage.onChanged.addListener((changes, namespaces) => {
  for (let [key, { _, newValue }] of Object.entries(changes)) {
    state = KEY_2_SETTER[key](newValue, state);
  }
});
