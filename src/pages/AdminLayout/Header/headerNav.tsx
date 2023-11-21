import Link from 'next/link'
import { Nav } from 'react-bootstrap'

export default function HeaderNav() {
  return (
    <Nav>
      <Nav.Item>
        <Link href="/indexMudanca" passHref legacyBehavior>
          <Nav.Link className="p-2">Inicio</Nav.Link>
        </Link>
      </Nav.Item>
    </Nav>
  )
}
