'use server'

import LayoutClient from "./layoutclient";
import { dados } from "../login/actions";

export default async function Layout({ children }) {

  const Logado = async () => {
    const usuario = await dados();
    if (usuario == null) {
      return { noLogin: true, usuario: null };
    } else {
      const getRole = (type) => {
        switch(type) {
          case 0:
            return "Administrador";
          case 1:
            return "Autor";
          case 2:
            return "Leitor";
        }
      };

      return {
        noLogin: false,
        usuario: {
          nome: usuario.user.name,
          email: usuario.user.email,
          admin: usuario.user.type === 0,
          birthDate: usuario.user.birthDate,
          nickname: usuario.user.nickname,
          id: usuario.user.id,
          role: getRole(usuario.user.type)
        }
      };
    }
  };

  const { noLogin, usuario } = await Logado();

  return (
    <LayoutClient usuario={noLogin ? null : usuario}>
      <>
        {children}
      </>
    </LayoutClient>
  )
}
