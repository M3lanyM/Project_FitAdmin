import React from 'react';
import {TextField} from '@mui/material';

const Formulario: React.FC = () => {
  return (
    <div className="input-group">
      <input type="text" className="input-area" required id="inputField" />
      <label htmlFor="inputField" className="label">
        Field
      </label>
    </div>
  );
};

export default Formulario;
