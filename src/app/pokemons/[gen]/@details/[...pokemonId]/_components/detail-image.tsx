import Image from "next/image";

export default function DetailImage({
  url,
  alt,
  bgColor
}: {
  url: string;
  alt: string;
  bgColor: string;
}) {
  return (
    <section
      className="relative flex justify-center items-center group cursor-pointer w-fit mx-auto"
    >
      <Image
        src={url}
        width={200}
        height={200}
        className="object-cover group-hover:scale-125 transition-transform duration-300"
        alt={alt}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`shadow-inner w-40 h-40 ${bgColor}/5 group-hover:${bgColor}/20 transition-colors duration-300 rounded-full z-[-1]`}></div>
      </div>
    </section>
  );
}