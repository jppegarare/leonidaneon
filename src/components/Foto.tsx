import { creditoImagem, imagem } from '../midia';

interface Props {
  chave: string;
  className?: string;
  sizes?: string;
  prioridade?: boolean;
  credito?: boolean;
  decorativa?: boolean;
}

/** Captura oficial com crédito à Rockstar Games. */
export default function Foto({ chave, className = '', sizes = '(max-width: 800px) 100vw, 50vw', prioridade = false, credito = true, decorativa = false }: Props) {
  const img = imagem(chave);
  return (
    <figure className={`foto ${className}`}>
      <img
        src={img.pequena}
        srcSet={`${img.pequena} 800w, ${img.grande} 1600w`}
        sizes={sizes}
        alt={decorativa ? '' : img.alt}
        loading={prioridade ? 'eager' : 'lazy'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        decoding="async"
        width={1600}
        height={900}
      />
      {credito && <figcaption className="credito">{creditoImagem}</figcaption>}
    </figure>
  );
}
