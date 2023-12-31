import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import SidebarNav from './SidebarNav'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function Sidebar(props: { isShow: boolean; isShowMd: boolean }) {
  const { isShow, isShowMd } = props
  const [isNarrow, setIsNarrow] = useState(false)

  const toggleIsNarrow = () => {
    const newValue = !isNarrow
    localStorage.setItem('isNarrow', newValue ? 'true' : 'false')
    setIsNarrow(newValue)
  }

  // On first time load only
  useEffect(() => {
    if (localStorage.getItem('isNarrow')) {
      setIsNarrow(localStorage.getItem('isNarrow') === 'true')
    }
  }, [setIsNarrow])

  return (
    <div
      className={classNames('sidebar d-flex flex-column position-fixed h-100', {
        'sidebar-narrow': isNarrow,
        show: isShow,
        'md-hide': !isShowMd,
      })}
      id="sidebar"
    >

      {/* Logo de la barra lateral */}
      <div className="sidebar-brand d-flex align-items-center justify-content-center mb-3 border-bottom ">
        <img src="/img/logo.png" alt="FitAdmin Logo" style={{ width: '55px' }} />
        {isNarrow ? null : <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: "#202020", marginTop: '5px' }}>FITADMIN</span>}
      </div>

      <div className="sidebar-nav flex-fill">
        <SidebarNav />
      </div>

      <button
        className="sidebar-toggler d-none d-md-inline-block rounded-0 text-end pe-4 fw-bold shadow-none"
        onClick={toggleIsNarrow}
        type="button"
        aria-label="sidebar toggler"
      >
        <NavigateBeforeIcon className="sidebar-toggler-chevron" style={{ fontSize: '40px', marginLeft: '13px' }} />
      </button>
    </div>
  )
}

export const SidebarOverlay = (props: { isShowSidebar: boolean; toggleSidebar: () => void }) => {
  const { isShowSidebar, toggleSidebar } = props

  return (
    <div
      tabIndex={-1}
      aria-hidden
      className={classNames('sidebar-overlay position-fixed top-0 bg-dark w-100 h-100 opacity-50', {
        'd-none': !isShowSidebar,
      })}
      onClick={toggleSidebar}
    />
  )
}
