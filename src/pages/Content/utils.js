export const writeToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const readFromClipboard = () => {
  return navigator.clipboard.readText();
};

export const isTextInputElement = (element) => {
  const TEXT_INPUT_TYPES = ['text', 'search', 'input', 'email', 'password'];
  return (
    element.tagName === 'TEXTAREA' ||
    (element.tagName === 'INPUT' && TEXT_INPUT_TYPES.includes(element.type))
  );
};

export const applyHandler = (function () {
  let handler;

  return (type, newHandler, options) => {
    document.body.removeEventListener(type, handler, options);
    handler = newHandler;
    document.body.addEventListener(type, handler, options);
  };
})();
