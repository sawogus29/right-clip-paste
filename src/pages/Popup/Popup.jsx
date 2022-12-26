import React, { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { ContentCopy, Visibility, ContentPasteGo } from '@mui/icons-material';
import ListItemSwitch from './ListItemSwitch';

function Popup() {
  const [isRightClipOn, setIsRightClipOn] = useState(true);
  const [isHoverEffectOn, setIsHoverEffectOn] = useState(true);
  const [isPasteToTextInputOn, setIsPasteToTextInputOn] = useState(true);
  const isContentHoverEffectOn = isRightClipOn && isHoverEffectOn;

  // initialization
  useEffect(() => {
    chrome.storage.sync
      .get({
        isRightClipOn: true,
        isHoverEffectOn: true,
        isPasteToTextInputOn: true,
      })
      .then((result) => {
        const { isRightClipOn, isHoverEffectOn, isPasteToTextInputOn } = result;
        setIsRightClipOn(isRightClipOn);
        setIsHoverEffectOn(isHoverEffectOn);
        setIsPasteToTextInputOn(isPasteToTextInputOn);
      });
  }, []);

  // switch handler
  useEffect(() => {
    chrome.storage.sync.set({ isRightClipOn });
    chrome.storage.local.set({
      isRightClipOn,
      isHoverEffectOn: isContentHoverEffectOn,
    });
  }, [isRightClipOn, isContentHoverEffectOn]);
  useEffect(() => {
    chrome.storage.sync.set({ isHoverEffectOn });
    chrome.storage.local.set({ isHoverEffectOn });
  }, [isHoverEffectOn]);
  useEffect(() => {
    chrome.storage.sync.set({ isPasteToTextInputOn });
    chrome.storage.local.set({ isPasteToTextInputOn });
  }, [isPasteToTextInputOn]);

  return (
    <div className="App">
      <List dense>
        <ListItemSwitch
          icon={<ContentCopy />}
          primaryText={'Clip'}
          secondaryText={'Right click to clip'}
          checked={isRightClipOn}
          onChange={() => setIsRightClipOn((prev) => !prev)}
        />
        <ListItemSwitch
          icon={<Visibility />}
          primaryText={'Hover Effect'}
          secondaryText={'show selection'}
          checked={isHoverEffectOn}
          onChange={() => setIsHoverEffectOn((prev) => !prev)}
          disabled={!isRightClipOn}
        />
        <ListItemSwitch
          icon={<ContentPasteGo />}
          primaryText={'Paste'}
          secondaryText={'Right click to paste on input field'}
          checked={isPasteToTextInputOn}
          onChange={() => setIsPasteToTextInputOn((prev) => !prev)}
        />
      </List>
    </div>
  );
}

export default Popup;
