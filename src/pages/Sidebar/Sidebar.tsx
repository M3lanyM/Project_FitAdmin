import { useContext } from 'react';
import Image from 'next/image'
import Link from "next/link"
import { HiUsers } from "react-icons/hi";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineCardMembership } from "react-icons/md";
import { HiOutlineClipboardDocumentCheck, HiOutlineDocumentText } from "react-icons/hi2";
import { RiArrowDropRightLine, RiArrowDropLeftLine } from "react-icons/ri";
import { SidebarContext } from './SidebarContext';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';


const sidebarItems = [

    {
        name: "Clientes",
        href: "/indexClient",
        icon: HiUsers,
    },
    {
        name: "Rutinas",
        href: "/indexRoutine",
        icon: BsCalendarWeek,
    },
    {
        name: "Ejercicios",
        href: "/indexExercise",
        icon: SportsGymnasticsIcon,
    },
    {
        name: "Membresias",
        href: "/indexMembership",
        icon: MdOutlineCardMembership,
    },
    {
        name: "Facturación",
        href: "/indexBill",
        icon: HiOutlineDocumentText,
    },
    {
        name: "Reportes",
        href: "/indexReport",
        icon: HiOutlineClipboardDocumentCheck,
    },
];

export default function Sidebar() {
    const { isCollapsedSidebar, toggleSidebarCollapseHandler } =
        useContext(SidebarContext);

    return (
        <div className="sidebar__wrapper">
            <button className="btn" onClick={toggleSidebarCollapseHandler}>
                <RiArrowDropLeftLine />
            </button>
            <aside className="sidebar" data-collapse={isCollapsedSidebar}>
                <div className="sidebar__top">
                    <Image
                        width={80}
                        height={80}
                        className="sidebar__logo"
                        src="/img/logo.png"
                        alt="logo"
                    />
                    <p className="sidebar__logo-name">FITADMIN</p>
                </div>
                <ul className="sidebar__list">
                    {sidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="sidebar__item" key={name}>
                            <Link href={href} className="sidebar__link">
                                <span className="sidebar__icon">
                                    <Icon />
                                </span>
                                <span className="sidebar__name">{name}</span>
                            </Link>
                        </li>
                    ))}

                </ul>
            </aside>
        </div>
    );
}
