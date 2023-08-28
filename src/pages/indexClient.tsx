import React from 'react';
import BaseLayout from "@/components/BaseLayout";
import TableClient, { initialData, TableData } from '@/components/TableClient';
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Search as SearchIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function ClientPage() {
  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();

  return (
    <BaseLayout>

      <div className='h'>
        <div className='h1'>
          <button className='btnClient'>+ Agregar Cliente</button>
          <div className='Descarga'>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="SearchIcon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Buscar cliente"
              sx={{
                width: '85%',
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2b8c8c',
                },
              }}
            />
            <Button variant="outlined"
              startIcon={<CloudDownloadIcon className="custom-icon" />}
              className="custom-button"
            >
              Excel
            </Button>
          </div>
        </div>


        <div className="Habilitados">
          <img className="enabled" src="/img/enabled.png" />
          <p className='text1'>{`${activeClientsCount}`}</p>
          <h1 className='text2H'>Habilitados</h1>
        </div>

        <div className="Desabilitados">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{`${deactiveClientsCount}`}</p>
          <h1 className='text2D'>Desabilitados</h1>
        </div>
      </div>

      <TableClient data={initialData} />
    </BaseLayout>
  );
}

function calculateActiveClientsCount() {
  const activeClients = initialData.filter(client => client.state === 'Activo');
  return activeClients.length;
}

function calculateDeactivateClientsCount() {
  const deactivateClients = initialData.filter(client => client.state === 'Desactivado');
  return deactivateClients.length;
}
