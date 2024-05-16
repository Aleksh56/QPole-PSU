import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { changeRoleFx } from './models/change-role';

const styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  formControl: {
    marginTop: 2,
    marginBottom: 2,
    minWidth: 120,
  },
  button: {
    marginTop: 2,
  },
};

const FrmAdmUserSettings = ({ open, handleClose, userId }) => {
  const [role, setRole] = useState('');

  const handleChange = (event) => setRole(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('User id:', userId);
    const response = await changeRoleFx({ userId });
    console.log(response);
    // handleClose();
  };

  return (
    <Modal open={open} onClose={() => handleClose(false)}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Настройки пользователя
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={styles.formControl}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
          {/* Add more settings fields here as needed */}
          <Button type="submit" variant="contained" color="primary" sx={styles.button}>
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default FrmAdmUserSettings;
