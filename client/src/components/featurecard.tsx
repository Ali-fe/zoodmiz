interface Feature {
  title: string;
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
    <div
      key={index}
      className="group bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <h4 className="text-base font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
        {feature.title}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};
export default FeatureCard;
