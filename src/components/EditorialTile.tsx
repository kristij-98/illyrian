import { RevealImage } from './RevealImage';

export function EditorialTile({ src }: { src?: string }) {
  return (
    <div className="border border-hairline bg-panel">
      <RevealImage src={src} alt="Editorial" className="aspect-[4/5]" />
    </div>
  );
}
