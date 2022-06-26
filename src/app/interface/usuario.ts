export interface UsuarioInterface {
  ok: boolean;
  mensaje: string;
  data?: Data;
  datas?: Array<Data>;
  token?: string;
  err?: any;
  iat?: any;
  exp?: any;
  cantidadUsuarios?: any;
}

export interface Data {
  _id: any;
  idReferencia: string;
  nombre: string;
  correo: string;
  password: string;
  avatar: string;
  telefono: string;
  direccion: {
    provincia: {
      id: number;
      name: string;
    };
    distrito: {
      id: number;
      province_id: number;
      name: string;
    };
    corregimiento: {
      id: number;
      district_id: number;
      name: string;
    };
    direccion: string;
  };
  fechaRegistro: string;
  role: roles;
  contSesion: number;
  estado: boolean;
}

type roles = 'admin' | 'cliente';
