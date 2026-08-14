export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location?: string;
  role?: string;
  company?: string;
  initials?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "transport-manager-midlands",
    quote:
      "Reliable and timely delivery support. GIPA has been instrumental in keeping our supply chain running smoothly.",
    name: "Transport Manager",
    location: "Midlands",
  },
  {
    id: "logistics-coordinator-london",
    quote:
      "Highly dependable transport company. Their professionalism and consistency set them apart.",
    name: "Logistics Coordinator",
    location: "London",
  },
  {
    id: "operations-director-scotland",
    quote:
      "Excellent safety and coordination standards. We trust GIPA with our most critical shipments.",
    name: "Operations Director",
    location: "Scotland",
  },
];
