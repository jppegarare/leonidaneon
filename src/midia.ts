import imagensJson from '../data/imagens.json';

/** Capturas oficiais (Rockstar Games, página de mídia do GTA VI), hospedadas em public/img/oficial. */
export const creditoImagem = imagensJson.credito;
export const fonteImagens = imagensJson.fonte;
export const avisoImagens = imagensJson.aviso;

const itens = imagensJson.itens as Record<string, { alt: string }>;
const base = import.meta.env.BASE_URL;

export interface Imagem {
  chave: string;
  alt: string;
  pequena: string; // 800 px
  grande: string; // 1600 px
}

export function imagem(chave: string): Imagem {
  const meta = itens[chave];
  if (!meta) throw new Error(`Imagem desconhecida: ${chave}`);
  return {
    chave,
    alt: meta.alt,
    pequena: `${base}img/oficial/${chave}-800.webp`,
    grande: `${base}img/oficial/${chave}-1600.webp`,
  };
}

export const fotosPersonagens: Record<string, string[]> = {
  'jason-duval': ['jason-duval-02', 'jason-duval-01', 'jason-duval-03'],
  'lucia-caminos': ['lucia-caminos-01', 'lucia-caminos-02', 'lucia-caminos-03'],
  'cal-hampton': ['cal-hampton-01', 'cal-hampton-02'],
  'boobie-ike': ['boobie-ike-02', 'boobie-ike-01'],
  'drequan-priest': ['drequan-priest-02'],
  'real-dimez': ['real-dimez-01', 'real-dimez-02'],
  'raul-bautista': ['raul-bautista-01', 'raul-bautista-02'],
  'brian-heder': ['brian-heder-01', 'brian-heder-02'],
};

export const fotosRegioes: Record<string, string[]> = {
  'vice-city': ['vice-city-02', 'vice-city-06', 'vice-city-03'],
  'leonida-keys': ['leonida-keys-01', 'leonida-keys-02'],
  grassrivers: ['grassrivers-02', 'grassrivers-01'],
  'port-gellhorn': ['port-gellhorn-01', 'port-gellhorn-02'],
  ambrosia: ['ambrosia-01', 'ambrosia-02'],
  'mount-kalaga': ['mount-kalaga-02', 'mount-kalaga-01'],
};

/** Capa de cada vídeo oficial (por ID do YouTube). */
export const capasVideos: Record<string, string> = {
  rz1B4B2yBZY: 'jason-and-lucia-06',
  tJbzMqJGH4k: 'jason-and-lucia-02',
  VQRLujxTm3c: 'jason-and-lucia-04',
  'QdBZY2fkU-0': 'jason-and-lucia-03',
};

export const fotosEdicoes: Record<string, string> = {
  standard: 'vice-city-02',
  ultimate: 'ultimate-02',
  'vintage-pack': 'vintage-vapid-stanier-01',
  upgrade: 'ultimate-grotti-cheetah-01',
};

export const todasAsChaves = Object.keys(itens);
