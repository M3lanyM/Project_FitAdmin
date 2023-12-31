import { RiArrowDropLeftLine } from "react-icons/ri";
import HeaderNav from "./headerNav";
import { BiHomeAlt2 } from "react-icons/bi";

type HeaderProps = {
  toggleSidebar: () => void;
  toggleSidebarMd: () => void;
}

export default function Header(props: HeaderProps) {
  const { toggleSidebar, toggleSidebarMd } = props

  return (
    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom alturaH">
      <div className="header-navbar">
        <button
          className="header-toggler btnColap"
          type="button"
          onClick={toggleSidebar}
        >
          <RiArrowDropLeftLine style={{ fontSize: '2rem' }} />
        </button>
        <button
          className="header-toggler btnColap2"
          type="button"
          onClick={toggleSidebarMd}
        >
          <RiArrowDropLeftLine style={{ fontSize: '2rem' }} />
        </button>

        <BiHomeAlt2 style={{ fontSize: '1.3rem', marginBottom: '1px', color: '#2b8c8cd7' }} />
        <div className="header-nav d-none d-md-flex">
          <HeaderNav />
        </div>

      </div>
    </header>
  )
}
