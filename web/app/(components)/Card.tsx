import Image from 'next/image';

export function Card({ src, alt, width, children, className }: { src: string; alt: string; width: number; children: React.ReactNode; className?: string; }) {
    return (
        <div className={`relative drop-shadow-xl w-48 h-64 overflow-hidden rounded-xl bg-[#3d3c3d] ${className}`}>
            <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132]">
                { children }
                <Image src={src} alt=""></Image>
            </div>
            <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
        </div>
    );
}