import React, { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormGroup } from '@mui/material';

function Popup() {
  const [isRightClipOn, setIsRightClipOn] = useState(true);
  const [isHoverEffectOn, setIsHoverEffectOn] = useState(true);
  const [isPasteToTextInputOn, setIsPasteToTextInputOn] = useState(true);

  // initialization
  useEffect(() => {
    chrome.storage.local
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
    chrome.storage.local.set({ isRightClipOn, isHoverEffectOn: isRightClipOn });
  }, [isRightClipOn]);
  useEffect(() => {
    chrome.storage.local.set({ isHoverEffectOn });
  }, [isHoverEffectOn]);
  useEffect(() => {
    chrome.storage.local.set({ isPasteToTextInputOn });
  }, [isPasteToTextInputOn]);

  return (
    <div className="App">
      <FormGroup className="form-group">
        <FormControlLabel
          label="right click to clip"
          control={
            <Switch
              checked={isRightClipOn}
              onChange={(e) => setIsRightClipOn(e.target.checked)}
            />
          }
        />
        <FormControlLabel
          label="hover effect"
          control={
            <Switch
              checked={isHoverEffectOn}
              onChange={(e) => setIsHoverEffectOn(e.target.checked)}
              disabled={!isRightClipOn}
            />
          }
        />
        <FormControlLabel
          label="paste to text input"
          control={
            <Switch
              checked={isPasteToTextInputOn}
              onChange={(e) => setIsPasteToTextInputOn(e.target.checked)}
            />
          }
        />
      </FormGroup>
    </div>
  );
}

export default Popup;
