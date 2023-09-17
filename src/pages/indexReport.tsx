import React from 'react';
import BaseLayout from "@/pages/Sidebar/BaseLayout";
import TableReport, { initialData, TableData } from '@/components/TableReport';
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Grade, Search as SearchIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Graph from "@/components/GraphReport"

export default function ReportPage() {
  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();

  return (
    <BaseLayout>
      <div className='container-report'>
        <div className="Ganancias">
          <img className="enabled" src="/img/money.png" />
          <p className='text1'>{`${activeClientsCount}`}</p>
          <h1 >Ganancias</h1>
        </div>
        <div className="Ingresos">
          <img className="enabled" src="/img/enabled.png" />
          <p className='text1'>{`${activeClientsCount}`}</p>
          <h1 className='text2H'>Ingresos</h1>
        </div>

        <div className="Cancelar">
          <img className="disabled" src="/img/disabled.png" />
          <p className='text1'>{`${deactiveClientsCount}`}</p>
          <h1 className='text2D'>Desabilitados</h1>
        </div>
        <div className="graph">
          <Graph />
        </div>


      </div>
      <TableReport data={initialData} />

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
