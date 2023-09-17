import {ReactNode} from 'react';
import Sidebar from './Sidebar';
import React from 'react';

interface Props{
    children: ReactNode | ReactNode[];
}
export default function BaseLayout({children} :Props){
  return (
    <div className="layout">
      <Sidebar />
      {children}
    </div>
  );
};
