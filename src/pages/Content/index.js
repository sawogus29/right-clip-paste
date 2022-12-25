/**
 * utils
 */
const writeToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const readFromClipboard = () => {
  return navigator.clipboard.readText();
};

const isTextInputElement = (element) => {
  const TEXT_INPUT_TYPES = ['text', 'search', 'input', 'email', 'password'];
  return (
    element.tagName === 'TEXTAREA' ||
    (element.tagName === 'INPUT' && TEXT_INPUT_TYPES.includes(element.type))
  );
};

const applyHandler = (function () {
  let handler;

  return (newHandler) => {
    document.body.removeEventListener(handler);
    handler = newHandler;
    document.body.addEventListener(handler);
  };
})();

const makeHandler = (isPasteToTextInputOn, isRightClipOn) => {
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
chrome.storage.onChanged.addEventListener((changes, namespaces) => {
  const KEY_2_SETTER = {
    isRightClipOn: setIsRightClipOn,
    isHoverEffectOn: setIsHoverEffectOn,
    isPasteToTextInputOn: setIsPasteToTextInputOn,
  };

  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    state = KEY_2_SETTER[key](newValue);
  }
});
