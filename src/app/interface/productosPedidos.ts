export interface ProductosPedidos {
  ok: boolean;
  mensaje: string;
  data?: Data;
  datas?: Array<Data>;
}

export interface Data {
  _id: any;
  idReferencia: string;
  nombre: string;
  cliente: any;
  pesoLibras: number;
  pesoVolumetrico: number;
  precio: number;
  delivery: number;
  itmbs: boolean;
  descripcion: string;
  fechaRegistro: string;
  fechaEntrega: string;
  tipo: string;
  estado: boolean;
}
