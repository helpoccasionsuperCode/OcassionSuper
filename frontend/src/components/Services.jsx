// import React from "react";
// import ServiceCard from "./ServiceCard";
// import {Image1,Image2,Image3,Image4,Image5,Image6} from "../assets"
// function Services() {
//   const services = [
//     {
//       image: Image1,
//       title: "Weddings",
//       subtitle: "By OccasionSuper",
//       description:
//         "Your dream wedding, perfectly planned. From grand celebrations to intimate ceremonies, find everything you need.",
//     },
//     {
//       image: Image2,
//       title: "Birthday",
//       subtitle: "By OccasionSuper",
//       description:
//         "Celebrate another year of joy! Discover vendors for cakes, decor, entertainment, and venues for all ages.",
//     },
//     {
//       image: Image3,
//       title: "Corporate",
//       subtitle: "By OccasionSuper",
//       description:
//         "Professional events made easy. Book venues, catering, and AV services for conferences, seminars, and team-building.",
//     },
//     {
//       image: Image4,
//       title: "Anniversary",
//       subtitle: "By OccasionSuper",
//       description:
//         "Mark your special milestones. Find romantic dinners, party planners, and unique experiences for anniversaries.",
//     },
//     {
//       image: Image5,
//       title: "Baby Shower",
//       subtitle: "By OccasionSuper",
//       description:
//         "Welcome your little one with a memorable celebration. Explore decor, games, and catering for baby showers.",
//     },
//     {
//       image: Image6,
//       title: "Theme Parties",
//       subtitle: "By OccasionSuper",
//       description:
//         "Unleash your creativity with unique theme parties. From Bollywood to superhero, find vendors to bring your vision to life.",
//     },
//   ];

//   return (
//     <section className="p-4">
//       {/* Header */}
//       <div className="text-center m-4">
//         <span className="bg-orange-50 text-global p-4 rounded-full text-lg font-medium">
//           ✨ Premium Services
//         </span>
//         <h2 className="text-3xl md:text-4xl font-bold mt-8">
//           Curated Event Experiences
//         </h2>
//         <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
//           Every service is handpicked and managed by OccasionSuper to ensure
//           exceptional quality and seamless execution
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {services.map((service, index) => (
//           <ServiceCard key={index} {...service} />
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Services;


import React from "react";
import ServiceCard from "./ServiceCard";
import {Image1,Image2,Image3,Image4,Image5,Image6} from "../assets"
function Services() {
  const services = [
    {
      image: Image1,
      title: "Weddings",
      subtitle: "By OccasionSuper",
      description:
        "Your dream wedding, perfectly planned. From grand celebrations to intimate ceremonies, find everything you need.",
    },
    {
      image: Image2,
      title: "Birthday",
      subtitle: "By OccasionSuper",
      description:
        "Celebrate another year of joy! Discover vendors for cakes, decor, entertainment, and venues for all ages.",
    },
    {
      image: Image3,
      title: "Corporate",
      subtitle: "By OccasionSuper",
      description:
        "Professional events made easy. Book venues, catering, and AV services for conferences, seminars, and team-building.",
    },
    {
      image: Image4,
      title: "Anniversary",
      subtitle: "By OccasionSuper",
      description:
        "Mark your special milestones. Find romantic dinners, party planners, and unique experiences for anniversaries.",
    },
    {
      image: Image5,
      title: "Baby Shower",
      subtitle: "By OccasionSuper",
      description:
        "Welcome your little one with a memorable celebration. Explore decor, games, and catering for baby showers.",
    },
    {
      image: Image6,
      title: "Theme Parties",
      subtitle: "By OccasionSuper",
      description:
        "Unleash your creativity with unique theme parties. From Bollywood to superhero, find vendors to bring your vision to life.",
    },
  ];

  return (
    <section className="p-4">
      {/* Header */}
      <div className="text-center m-4">
        <span className="bg-orange-50 text-global p-4 rounded-full text-lg font-medium">
          ✨ Premium Services
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-8">
          Curated Event Experiences
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Every service is handpicked and managed by OccasionSuper to ensure
          exceptional quality and seamless execution
        </p>
      </div>

      {/* Cards */}
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
}

export default Services;
