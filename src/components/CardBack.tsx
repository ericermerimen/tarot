import Image from 'next/image';

interface CardBackProps {
  width: number;
  height: number;
}

export default function CardBack({ width, height }: CardBackProps) {
  return (
    <div style={{ position: 'relative', width, height, borderRadius: 12, overflow: 'hidden' }}>
      <Image
        src="/cards/card-base.png"
        alt="Card back"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
}
