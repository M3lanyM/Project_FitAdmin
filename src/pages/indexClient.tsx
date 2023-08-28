import React from 'react';
import BaseLayout from "@/components/BaseLayout";
import TableClient, { initialData, TableData } from '@/components/TableClient';

export default function ClientPage() {
  const activeClientsCount = calculateActiveClientsCount();
  const deactiveClientsCount = calculateDeactivateClientsCount();


  return (
    <BaseLayout>
    <div className='h'>

        <div className="Habilitados">
          <img className="service-img2" src="/img/enabled.png" />
          <p>{`${activeClientsCount}`}</p>
          <h1>Habilitados</h1>
        </div>

        <div className="Desabilitados">
          <img className="service-img2" src="/img/disabled.png" />
          <p>{`${deactiveClientsCount}`}</p>
          <h1>Desabilitados</h1>
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
