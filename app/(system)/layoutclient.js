'use client'

import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from "../login/actions";
import { userAgent } from "next/server";

export default function LayoutClient({ children, usuario }) {

    const route = usePathname();
    const handleSair = async () => {
        await logout();
    }
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
                                <span className="block text-sm">{usuario.nome}</span>
                                <span className="block truncate text-sm font-medium">{usuario.email}</span>
                                <span className="block text-sm">{usuario.role}</span>
                                <Link href="/profile" className="block text-sm">Ver Perfil</Link>
                                <Link href={`/publications/${usuario.id}`} className="block text-sm">Minhas Notícias</Link>
                            </DropdownHeader>
                            <DropdownItem onClick={handleSair}>Sair</DropdownItem>
                        </Dropdown>
                        <NavbarToggle />
                    </div>
                    <NavbarCollapse>
                        <NavbarLink as={Link} href="/" active={route === '/'}>Início</NavbarLink>
                        <NavbarLink as={Link} href="/news" active={route === '/news'}>Notícias</NavbarLink>
                        { usuario.admin ? <NavbarLink as={Link} href="/comment" active={route === '/comment'}>Comentários</NavbarLink> : null}
                        { usuario.admin ? <NavbarLink as={Link} href="/author" active={route === '/author'}>Autores</NavbarLink> : null}
                        { usuario.admin ? <NavbarLink as={Link} href="/reader" active={route === '/reader'}>Leitores</NavbarLink> : null}
                        { usuario.admin ? <NavbarLink as={Link} href="/reaction" active={route === '/reaction'}>Reações</NavbarLink> : null}
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