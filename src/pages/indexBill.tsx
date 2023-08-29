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
            <div className='searchBill'>
                <label htmlFor="Nombre" className="date-bornBill">
                    Seleccione la fecha a buscar
                </label>

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
                        width: '35%', height: '1%',marginRight:'-19%',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2b8c8c',
                        },

                    }}
                />
            </div>
            <TableBill />
        </BaseLayout>
    );
}