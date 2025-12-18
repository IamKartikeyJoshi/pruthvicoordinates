import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Ruler, Award } from "lucide-react";

const Portfolio = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Sabarmati Riverfront Development",
      category: "Infrastructure",
      location: "Ahmedabad, Gujarat",
      year: "2018-2022",
      area: "11.5 km corridor",
      description: "Comprehensive topographical and control survey for the iconic Sabarmati Riverfront Development project. Our team established the primary geodetic network and provided ongoing as-built documentation throughout the construction phases.",
      services: ["DGPS Control Network", "Topographical Survey", "As-Built Documentation", "Progress Monitoring"],
      highlight: "Zero-deviation from design specifications throughout 4-year project",
      bgClass: "bg-gradient-to-br from-blue-900/20 to-slate-900/40",
    },
    {
      id: 2,
      title: "GIFT City Master Plan Survey",
      category: "Urban Development",
      location: "Gandhinagar, Gujarat",
      year: "2019-2021",
      area: "886 acres",
      description: "Complete cadastral and topographical survey for Gujarat International Finance Tec-City (GIFT City). Established survey control framework and provided boundary demarcation for all plots within the special economic zone.",
      services: ["Cadastral Survey", "Plot Demarcation", "Control Network", "GIS Database"],
      highlight: "Served as official survey record for all land transactions in GIFT City",
      bgClass: "bg-gradient-to-br from-amber-900/20 to-orange-900/40",
    },
    {
      id: 3,
      title: "Mundra Port Expansion",
      category: "Industrial",
      location: "Kutch, Gujarat",
      year: "2020",
      area: "450 hectares",
      description: "Large-scale topographical survey and bathymetric mapping for Adani Port expansion project. Combined drone photogrammetry with traditional methods to deliver comprehensive terrain data for engineering design.",
      services: ["Drone Photogrammetry", "Bathymetric Survey", "Volume Calculations", "Progress Monitoring"],
      highlight: "Completed 450-hectare survey in just 21 days using drone technology",
      bgClass: "bg-gradient-to-br from-cyan-900/20 to-teal-900/40",
    },
  ];

  const projectCategories = [
    {
      name: "Residential & Commercial",
      count: "450+",
      description: "Boundary surveys, plot layouts, and construction stakeout for housing societies, commercial complexes, and individual properties.",
      projects: [
        "Godrej Garden City - 600 plot subdivision",
        "Iscon Platinum - High-rise setting out",
        "Shela Township - 200 acre master plan",
        "Sindhu Bhavan Road Commercial Hub",
      ],
    },
    {
      name: "Infrastructure & Roads",
      count: "180+",
      description: "Route surveys, corridor mapping, and as-built documentation for highways, metro rail, and utility corridors.",
      projects: [
        "Ahmedabad Metro Phase-1 Alignment",
        "NH-48 Bypass Route Survey",
        "BRTS Corridor Documentation",
        "Ring Road Widening Survey",
      ],
    },
    {
      name: "Industrial & Mining",
      count: "120+",
      description: "Site surveys, volumetric calculations, and progress monitoring for industrial facilities and mining operations.",
      projects: [
        "Essar Steel Plant Expansion",
        "Ambuja Cement Quarry Mapping",
        "GIDC Industrial Estate Surveys",
        "Solar Park Land Assessment",
      ],
    },
    {
      name: "Government & Municipal",
      count: "250+",
      description: "Revenue surveys, municipal mapping, and official demarcation work for government bodies and local authorities.",
      projects: [
        "AMC Ward Boundary Revision",
        "Village Map Digitization Project",
        "Revenue Record Verification",
        "Smart City GIS Database",
      ],
    },
  ];

  const clients = [
    { name: "Adani Group", type: "Corporate" },
    { name: "Godrej Properties", type: "Real Estate" },
    { name: "L&T Construction", type: "Infrastructure" },
    { name: "Gujarat Government", type: "Government" },
    { name: "Ahmedabad Municipal Corporation", type: "Municipal" },
    { name: "NHAI", type: "Government" },
    { name: "Torrent Power", type: "Utility" },
    { name: "Zydus Cadila", type: "Pharmaceutical" },
  ];

  const testimonials = [
    {
      quote: "Pruthvi Co-ordinates has been our go-to surveyor for over a decade. Their accuracy and professionalism are unmatched in the industry.",
      author: "Rakesh Mehta",
      position: "Project Director, L&T Infrastructure",
    },
    {
      quote: "The boundary survey they conducted helped us resolve a long-standing dispute. Their documentation was accepted without question by the revenue tribunal.",
      author: "Advocate Suresh Patel",
      position: "Property Law Specialist",
    },
    {
      quote: "Fast, accurate, and always available when we need them. We have relied on their surveys for all our township projects.",
      author: "Nitin Shah",
      position: "VP Operations, Goyal Group",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="grid-pattern h-full" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                Selected Works
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-background mb-8">
                Mapping the <br />
                <span className="italic text-background/80">Infrastructure</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-background/70 max-w-2xl leading-relaxed">
                From iconic landmarks to essential infrastructure, our surveys have shaped Gujarat development story. Explore our portfolio of precision work.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-accent text-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              <div>
                <div className="font-serif text-3xl md:text-4xl font-bold">1,500+</div>
                <div className="font-mono text-xs tracking-widest opacity-80">Projects Completed</div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl font-bold">50,000+</div>
                <div className="font-mono text-xs tracking-widest opacity-80">Hectares Surveyed</div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl font-bold">500+</div>
                <div className="font-mono text-xs tracking-widest opacity-80">Clients Served</div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl font-bold">34</div>
                <div className="font-mono text-xs tracking-widest opacity-80">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Featured Projects
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                Landmark <span className="italic text-accent">Work</span>
              </h2>
            </div>

            <div className="space-y-12">
              {featuredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`border border-foreground/10 overflow-hidden ${index % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
                >
                  <div className="grid lg:grid-cols-2">
                    {/* Image/Visual Side */}
                    <div className={`${project.bgClass} p-12 min-h-[400px] flex flex-col justify-end relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="currentColor" className="text-foreground" />
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <div className="font-mono text-7xl text-white/10 font-bold mb-4">0{project.id}</div>
                        <div className="inline-block px-3 py-1 bg-accent text-white font-mono text-xs tracking-widest uppercase mb-4">
                          {project.category}
                        </div>
                        <h3 className="font-serif text-3xl md:text-4xl text-white">{project.title}</h3>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 lg:p-12 bg-popover">
                      <div className="flex flex-wrap gap-6 mb-6 text-sm text-foreground/60">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          {project.year}
                        </div>
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-accent" />
                          {project.area}
                        </div>
                      </div>

                      <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                        {project.description}
                      </p>

                      <div className="mb-6">
                        <div className="font-mono text-xs text-foreground/40 mb-3 tracking-widest uppercase">Services Provided</div>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service) => (
                            <span key={service} className="px-3 py-1 bg-foreground/5 text-foreground/70 font-mono text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-accent/10 border-l-4 border-accent">
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-mono text-xs text-accent mb-1 tracking-widest uppercase">Key Achievement</div>
                            <p className="text-foreground/80">{project.highlight}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Categories */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                By Sector
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                Industry <span className="italic text-accent">Experience</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {projectCategories.map((category) => (
                <div key={category.name} className="bg-popover p-8 border border-foreground/10 hover:border-accent transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif text-2xl text-foreground">{category.name}</h3>
                    <span className="font-mono text-3xl text-accent font-bold">{category.count}</span>
                  </div>
                  <p className="text-foreground/60 mb-6">{category.description}</p>
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-foreground/40 tracking-widest uppercase mb-3">Notable Projects</div>
                    {category.projects.map((project) => (
                      <div key={project} className="flex items-center gap-2 text-foreground/70 text-sm">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Trusted By
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Our <span className="italic text-accent">Clients</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {clients.map((client) => (
                <div key={client.name} className="text-center p-6 border border-foreground/10 hover:border-accent transition-colors group">
                  <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                    <span className="font-serif text-xl text-foreground/30 group-hover:text-accent transition-colors">
                      {client.name.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-foreground mb-1">{client.name}</h4>
                  <div className="font-mono text-xs text-foreground/50">{client.type}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                Client Feedback
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl text-background">
                Words of <span className="italic text-background/80">Trust</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border border-background/20 p-8">
                  <div className="font-serif text-6xl text-accent/30 mb-4">"</div>
                  <blockquote className="font-serif text-lg text-background/90 italic mb-6 leading-relaxed">
                    {testimonial.quote}
                  </blockquote>
                  <div>
                    <div className="font-bold text-background">{testimonial.author}</div>
                    <div className="font-mono text-xs text-background/50">{testimonial.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                Your Project Could Be <span className="italic text-accent">Next</span>
              </h2>
              <p className="text-foreground/60 text-lg mb-8">
                Join the hundreds of clients who trust Pruthvi Co-ordinates for their surveying needs. Let us add your project to our portfolio of precision work.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
