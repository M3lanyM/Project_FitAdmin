import React, { useState } from 'react';
import BaseLayout from "@/components/BaseLayout";
import { TextField, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import { Search as SearchIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TableBill from '@/components/TableBill';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

export default function BillPage() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    return (
        <BaseLayout>
            <div className='hBill'>
                <div className='ContaBill'>
                    <label className="custom-labelBill">FACTURACIÓN</label>
                    <label htmlFor="Nombre" className="labelBill">
                        Seleccione la fecha a buscar:
                    </label>

                    <div className='searchBill'>
                        <input
                            className="starDate"
                            type="date"
                            name="starDate"
                            placeholder="Fecha de Nacimiento"
                        />
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
                                width: '80%', height: '1%',
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2b8c8c',
                                },
                                marginTop: '3%', marginLeft: '20px',
                            }}
                        />
                    </div>
                </div>
                <div className="addBill">
                    <button className='btnaddBill'>
                        + Agregar Factura
                    </button>
                </div>
            </div>
            <TableBill />
        </BaseLayout>
    );
}