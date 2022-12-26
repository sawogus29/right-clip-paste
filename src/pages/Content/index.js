/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { render } from 'react-dom';
import Snackbar from '@mui/material/Snackbar';

import {
  writeToClipboard,
  readFromClipboard,
  isTextInputElement,
  useHandler,
} from './utils';

/**
 * utils
 */
const rootElement = document.createElement('div');
rootElement.id = 'rcp-root';
document.body.appendChild(rootElement);

const renderSnackbar = (text, open = true, duration = 1000, maxLength = 50) => {
  const ellipsedText =
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  render(
    <Snackbar
      className="rcp-snackbar"
      open={open}
      autoHideDuration={duration}
      message={ellipsedText + '  ' + '📋'}
      onClose={() => renderSnackbar(text, false)}
    />,
    rootElement
  );
};

const applyRightClickHandler = useHandler('contextmenu', { capture: true });

const makeRightClickHandler = (isPasteToTextInputOn, isRightClipOn) => {
  if (!isPasteToTextInputOn && !isRightClipOn) {
    return null;
  }

  const preventAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  const pasteHandler = (e) => {
    preventAll(e);

    readFromClipboard().then((text) => {
      e.target.value = text;
    });
  };

  const copyHandler = (e) => {
    preventAll(e);

    console.log(e.target.innerText);
    writeToClipboard(e.target.innerText);
    renderSnackbar(e.target.innerText);
  };

  return (e) => {
    if (isTextInputElement(e.target) && isPasteToTextInputOn) {
      pasteHandler(e);
      return;
    }

    if (!isTextInputElement(e.target) && isRightClipOn) {
      copyHandler(e);
      return;
    }
  };
};

/**
 * setter
 */
const setIsRightClipOn = (isRightClipOn, state) => {
  const { isPasteToTextInputOn } = state;

  applyRightClickHandler(
    makeRightClickHandler(isPasteToTextInputOn, isRightClipOn)
  );

  return { ...state, isRightClipOn };
};

const setIsHoverEffectOn = (isHoverEffectOn, state) => {
  document.body.dataset.rcpIsHoverEffectOn = isHoverEffectOn;

  return { ...state, isHoverEffectOn };
};

const setIsPasteToTextInputOn = (isPasteToTextInputOn, state) => {
  const { isRightClipOn } = state;

  applyRightClickHandler(
    makeRightClickHandler(isPasteToTextInputOn, isRightClipOn)
  );

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
