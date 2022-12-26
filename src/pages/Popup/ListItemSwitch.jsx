import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@mui/material';

const ListItemSwitch = (props) => {
  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton disabled={props.disabled} onClick={props.onChange}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText
          primary={props.primaryText}
          secondary={props.secondaryText}
        />
        <Switch checked={props.checked} />
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemSwitch;
