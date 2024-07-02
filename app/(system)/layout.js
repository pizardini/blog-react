'use client'

import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {

    const route = usePathname();

    return (
        <>
            <header>
                <Navbar fluid className="bg-neutral-100">
                    <NavbarBrand as={Link} href="/">
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Blog Notícias</span>
                    </NavbarBrand>
                    <div className="flex md:order-2">
                        <Dropdown arrowIcon={false} inline label={<Avatar rounded />}>
                            <DropdownHeader>
                                <span className="block text-sm">Usuário</span>
                                <span className="block truncate text-sm font-medium">usuario@email.com</span>
                            </DropdownHeader>
                            <DropdownItem>Sair</DropdownItem>
                        </Dropdown>
                        <NavbarToggle />
                    </div>
                    <NavbarCollapse>
                        <NavbarLink as={Link} href="/" active={route === '/'}>Início</NavbarLink>
                        <NavbarLink as={Link} href="/author" active={route === '/curso'}>Autor</NavbarLink>
                        <NavbarLink as={Link} href="/reader" active={route === '/tipocurso'}>Leitor</NavbarLink>
                    </NavbarCollapse>
                </Navbar>
            </header>
            <main>
                <ToastContainer position="top-right" autoClose={3000} className="text-sm" theme="colored" />
                <div className="mx-4 my-2">
                    {children}
                </div>
            </main>
        </>
    )
}