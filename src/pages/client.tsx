import React from 'react';
import BaseLayout from "@/components/BaseLayout";
import TableWithPagination from '@/components/TableClient';

export default function ClientPage() {
    return (
      <BaseLayout>
        <TableWithPagination />
      </BaseLayout>
    );
  }