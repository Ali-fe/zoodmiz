interface CoverArtProps {
  /** نام غذا یا رستوران؛ مبنای رنگ و حرف نمایشی */
  name: string;
  src?: string;
  className?: string;
  textClass?: string;
}

const hueOf = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + (seed.codePointAt(index) || 0)) % 360;
  }
  return hash;
};

/* جای‌نماهای تصویر در این پروژه عمدتاً خالی‌اند؛ به‌جای مربع خاکستری،
   هر نام یک پوشش گرادیانی ثابت خودش را می‌گیرد تا ظاهر لیست‌ها پر بماند. */
const CoverArt = ({ name, src, className = 'h-40 w-40', textClass = 'text-2xl' }: CoverArtProps) => {
  if (src) {
    return <img src={src} alt={name} loading="lazy" className={`object-cover ${className}`} />;
  }

  const hue = hueOf(name || 'زودمیز');
  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 92% 68%), hsl(${(hue + 42) % 360} 80% 44%))`,
      }}
    >
      <span className="absolute -left-4 -top-4 h-14 w-14 rounded-full bg-white/25 blur-xl" />
      <span className="absolute -right-5 bottom-[-14px] h-16 w-16 rounded-full bg-black/15 blur-xl" />
      <span
        className={`relative font-vazirmatn-title font-bold text-white/90 drop-shadow-sm ${textClass}`}
      >
        {(name || 'ز').trim().slice(0, 1)}
      </span>
    </div>
  );
};

export default CoverArt;
