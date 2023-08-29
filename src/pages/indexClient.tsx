import React, { useState } from 'react';
import BaseLayout from "@/components/BaseLayout";
import TableClient, { initialData, TableData } from '@/components/TableClient';
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Search as SearchIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ModalAddCliend from '@/components/ModalAddCliend';


export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();

  return (
    <BaseLayout>
      <div className='hClient'>
        <div className='ContaH'>
          <button onClick={openModal} className='btnClient'>
            + Agregar Cliente
          </button>

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
                marginRight: '30px',
              }}
            />
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon className="custom-icon" />}
              sx={{
                width: '30%',
                color: '#2b8c8c',
                fontWeight: 'bold',
                borderColor: '#2b8c8c',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#2b8c8c',
                  borderWidth: 2,
                },
              }}
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

        <div className="Deshabilitados">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{`${deactiveClientsCount}`}</p>
          <h1 className='text2D'>Deshabilitados</h1>
        </div>
      </div>

      <TableClient data={initialData} />
      {isModalOpen && <ModalAddCliend onClose={closeModal} />}
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
