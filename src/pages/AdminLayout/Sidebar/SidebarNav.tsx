import { HiUsers } from "react-icons/hi";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineCardMembership } from "react-icons/md";
import { HiOutlineClipboardDocumentCheck, HiOutlineDocumentText } from "react-icons/hi2";
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import React, { PropsWithChildren, useState, } from 'react'
import {Nav } from 'react-bootstrap'
import IconButton from '@mui/material/IconButton';
import Link from 'next/link'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type SidebarNavItemProps = {
  href: string;
  icon?: React.ReactNode;
} & PropsWithChildren

const SidebarNavItem = (props: SidebarNavItemProps) => {
  const {
    icon,
    children,
    href,
  } = props

  return (
    <Nav.Item className="espacio">
      <Link href={href} passHref legacyBehavior>
      <a className="nav-link espacioS py-1 d-flex align-items-center altura">
      {icon && <span className="nav-icon margenS">{icon}</span>}
          <span className="nav-icon ms-n3">{children}</span>
        </a>
      </Link>
    </Nav.Item>
  )
}


type SidebarNavGroupToggleProps = {
  eventKey: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  setIsShow: (isShow: boolean) => void;
};

const SidebarNavGroupToggle = (props: SidebarNavGroupToggleProps) => {
  const { eventKey, icon, children, setIsShow } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsShow(!isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <IconButton
      onClick={handleClick}
      className={`rounded-0 nav-link px-3 py-2 d-flex align-items-center flex-fill w-100 shadow-none ${isExpanded ? '' : 'collapsed'}`}
    >
      <span className="nav-icon ms-n3">{icon}</span>
      {children}
      <div className="nav-chevron ms-auto text-end">
        <ExpandMoreIcon />
      </div>
    </IconButton>
  );
};

type SidebarNavGroupProps = {
  toggleIcon: React.ReactNode;
  toggleText: string;
} & PropsWithChildren

// Reemplaza el componente SidebarNavGroup
const SidebarNavGroup = (props: SidebarNavGroupProps) => {
  const { toggleIcon, toggleText, children } = props;
  const [isShow, setIsShow] = useState(false);

  return (
    <Accordion expanded={isShow} onChange={() => setIsShow(!isShow)}>
      <SidebarNavGroupToggle icon={toggleIcon} eventKey="0" setIsShow={setIsShow}>
        {toggleText}
      </SidebarNavGroupToggle>
      <AccordionDetails>
        <ul className="nav-group-items list-unstyled">{children}</ul>
      </AccordionDetails>
    </Accordion>
  );
};


export default function SidebarNav() {
  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={<HiUsers style={{ fontSize: '1.4rem' }} />} href="/indexClient">
        Clientes
        <small className="ms-auto"></small>
      </SidebarNavItem>
      <SidebarNavItem icon={<BsCalendarWeek style={{ fontSize: '1.3rem' }} />} href="/indexRoutines">
        Rutinas
        <small className="ms-auto"></small>
      </SidebarNavItem>
      <SidebarNavItem icon={<SportsGymnasticsIcon style={{ fontSize: '1.7rem' }} />} href="/indexExercise">
        Ejercicios
        <small className="ms-auto"></small>
      </SidebarNavItem>
      <SidebarNavItem icon={<MdOutlineCardMembership style={{ fontSize: '1.6rem' }} />} href="/indexMembership">
        Membresias
        <small className="ms-auto"></small>
      </SidebarNavItem>
      <SidebarNavItem icon={<HiOutlineDocumentText style={{ fontSize: '1.7rem' }} />} href="/indexBill">
        Facturación
        <small className="ms-auto"></small>
      </SidebarNavItem>
      <SidebarNavItem icon={<HiOutlineClipboardDocumentCheck style={{ fontSize: '1.7rem' }} />} href="/indexReport">
        Reportes
        <small className="ms-auto"></small>
      </SidebarNavItem>
    </ul>
  )
}
