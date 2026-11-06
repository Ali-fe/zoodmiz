interface Feature {
  title: string;
  tag?: string;
  description: string;
  image: string;
}

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  return (
    <article
      style={{ animationDelay: `${index * 90}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary-50 dark:bg-gray-700">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70" />
        {feature.tag && (
          <span className="absolute start-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-700 shadow-card backdrop-blur">
            {feature.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h4 className="font-vazirmatn-title text-base font-bold text-gray-800 transition-colors duration-200 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-300">
          {feature.title}
        </h4>
        <span className="h-0.5 w-8 rounded-full bg-primary-200 transition-all duration-300 group-hover:w-16 group-hover:bg-primary dark:bg-primary-500/30" />
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
      </div>
    </article>
  );
};

export default FeatureCard;
