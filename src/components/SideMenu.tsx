import React from 'react'
import { Menu, Home, FileText, Settings, HelpCircle } from 'lucide-react'

type MenuItem = {
  icon: React.ReactNode
  label: string
  href: string
}

type SideMenuProps = {
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const menuItems: MenuItem[] = [
  { icon: <Home className="w-6 h-6" />, label: 'Home', href: '/' },
  // { icon: <FileText className="w-6 h-6" />, label: 'Reports', href: '#' },
  // { icon: <Settings className="w-6 h-6" />, label: 'Settings', href: '#' },
  // { icon: <HelpCircle className="w-6 h-6" />, label: 'Help', href: '#' },
]

export default function SideMenu({ isOpen, onMouseEnter, onMouseLeave }: SideMenuProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-5'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="navigation"
      aria-label="Main menu"
    >
      <div className="p-4">
        <Menu className="w-8 h-8" />
      </div>
      <nav className="mt-8">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-4">
              <a href={item.href} className="flex items-center p-2 hover:bg-gray-700">
                {item.icon}
                {isOpen && <span className="ml-2">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}