import React from "react";

const features = [
  {
    title: "Report & Track Issues",
    description:
      "Users can easily report civic issues and monitor their progress in real-time.",
  },
  {
    title: "Bid & Earn",
    description:
      "Gig workers can find nearby issues, bid for tasks, and get rewarded upon completion.",
  },
  {
    title: "Smart Dashboard",
    description:
      "Governments get an AI-driven dashboard for assigning, tracking, and funding efficiently.",
  },
];

const Features = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800">
        Platform Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-3 text-blue-600">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
