import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, FileText, Users } from "lucide-react";

const Services = () => {
  const services = [
    {
      number: "01",
      title: "Topographical Survey",
      subtitle: "For Architects & Urban Planners",
      description: "Comprehensive three-dimensional mapping of terrain, structures, and natural features. Our topographical surveys provide the essential baseline data for site planning, engineering design, and development feasibility studies.",
      deliverables: [
        "Detailed contour maps at specified intervals",
        "Digital Terrain Model (DTM) files",
        "Feature inventory with coordinates",
        "Cross-sections and profiles",
        "AutoCAD and GIS-compatible files",
      ],
      timeline: "3-10 working days",
      idealFor: "Architects, Civil Engineers, Urban Planners, Developers",
    },
    {
      number: "02",
      title: "Boundary Demarcation",
      subtitle: "Legal Boundary Identification",
      description: "Precise identification and physical marking of property boundaries based on title documents, revenue records, and field evidence. Our demarcation surveys are legally defensible and accepted by courts and government authorities.",
      deliverables: [
        "Boundary survey report with coordinates",
        "Physical boundary markers installed",
        "Area calculation certificate",
        "Comparison with revenue records",
        "Photographic documentation",
      ],
      timeline: "2-5 working days",
      idealFor: "Property Owners, Real Estate Developers, Legal Professionals",
    },
    {
      number: "03",
      title: "Plotting & Layout",
      subtitle: "Subdivision & Infrastructure Marking",
      description: "Transfer of approved plans to the physical site for construction guidance. We ensure that subdivisions, building footprints, roads, and utilities are positioned exactly as designed with millimeter-level accuracy.",
      deliverables: [
        "Physical stakes/markers at key points",
        "As-staked coordinate report",
        "Deviation report from design",
        "Reference benchmark establishment",
        "Progress verification surveys",
      ],
      timeline: "1-3 working days",
      idealFor: "Construction Companies, Real Estate Developers, Municipal Bodies",
    },
    {
      number: "04",
      title: "DGPS Control Survey",
      subtitle: "Geodetic Network Establishment",
      description: "Establishment of high-precision control networks using Differential GPS technology. These reference points form the backbone for all subsequent survey work, ensuring consistency across large project areas.",
      deliverables: [
        "Control point coordinate list (WGS84/Local)",
        "Network adjustment report",
        "Physical monument installation",
        "Transformation parameters",
        "Quality metrics and error ellipses",
      ],
      timeline: "5-15 working days",
      idealFor: "Infrastructure Projects, Municipal Mapping, Large Developments",
    },
    {
      number: "05",
      title: "As-Built Survey",
      subtitle: "Construction Verification & Documentation",
      description: "Post-construction surveys capturing the actual positions and dimensions of completed work. Critical for compliance verification, facility management, and creating accurate records for future modifications.",
      deliverables: [
        "As-built drawings in CAD format",
        "Comparison with design drawings",
        "Deviation report and analysis",
        "3D model (upon request)",
        "BIM integration ready files",
      ],
      timeline: "3-7 working days",
      idealFor: "Construction Companies, Facility Managers, Regulatory Bodies",
    },
    {
      number: "06",
      title: "Contour Mapping",
      subtitle: "Elevation Analysis & Drainage",
      description: "Detailed elevation surveys generating precise contour maps essential for drainage analysis, cut-fill calculations, and landscape design. Available at intervals from 0.25m to 5m based on project requirements.",
      deliverables: [
        "Contour map at specified interval",
        "Spot elevation grid",
        "Digital Elevation Model (DEM)",
        "Volume calculations",
        "Drainage pattern analysis",
      ],
      timeline: "3-7 working days",
      idealFor: "Landscape Architects, Drainage Engineers, Site Planners",
    },
    {
      number: "07",
      title: "LiDAR Survey",
      subtitle: "High-Density Point Cloud Mapping",
      description: "Advanced Light Detection and Ranging technology for capturing millions of precise 3D points. Ideal for complex terrain, vegetation analysis, and infrastructure modeling with unmatched accuracy and detail.",
      deliverables: [
        "High-density point cloud data",
        "Digital Terrain Model (DTM/DSM)",
        "Vegetation analysis reports",
        "3D infrastructure models",
        "Cross-sections and profiles",
      ],
      timeline: "3-7 working days",
      idealFor: "Forestry Projects, Power Line Corridors, Flood Modeling",
    },
    {
      number: "08",
      title: "Drone Aerial Survey",
      subtitle: "Large Area Photogrammetry",
      description: "Rapid coverage of large areas using professional-grade drones equipped with RTK positioning. Ideal for projects where traditional methods would be time-prohibitive or for areas with difficult terrain access.",
      deliverables: [
        "Orthomosaic imagery",
        "Digital Surface Model (DSM)",
        "3D point cloud",
        "Volume calculations",
        "Progress comparison reports",
      ],
      timeline: "2-5 working days",
      idealFor: "Mining Operations, Agricultural Projects, Construction Monitoring",
    },
    {
      number: "09",
      title: "Bathymetry Survey",
      subtitle: "Underwater Topography Mapping",
      description: "Precise measurement of underwater depths and seabed topography using advanced sonar and GPS technology. Essential for marine construction, dredging, and water resource management.",
      deliverables: [
        "Bathymetric contour maps",
        "Seabed surface models",
        "Volume calculations",
        "Cross-sections of water bodies",
        "Depth charts and profiles",
      ],
      timeline: "5-10 working days",
      idealFor: "Ports & Harbors, Dam Projects, Marine Construction",
    },
    {
      number: "10",
      title: "Route Survey",
      subtitle: "Linear Infrastructure Corridors",
      description: "Specialized surveys for linear projects including roads, pipelines, transmission lines, and railways. We provide complete corridor mapping with centerline profiles, cross-sections, and right-of-way data.",
      deliverables: [
        "Centerline coordinates and alignment",
        "Profile and cross-sections",
        "Right-of-way boundary data",
        "Utility conflict mapping",
        "Volume calculations for earthwork",
      ],
      timeline: "Variable based on length",
      idealFor: "Highway Authorities, Pipeline Companies, Utility Providers",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We discuss your project requirements, review available documents, and understand your accuracy needs and timeline constraints.",
    },
    {
      step: "02",
      title: "Proposal & Agreement",
      description: "You receive a detailed proposal outlining scope, methodology, deliverables, timeline, and cost. Clear terms, no surprises.",
    },
    {
      step: "03",
      title: "Field Survey",
      description: "Our team conducts the field work using appropriate equipment and methodologies, adhering to strict quality protocols.",
    },
    {
      step: "04",
      title: "Data Processing",
      description: "Raw field data is processed, verified, and transformed into the required deliverable formats with full quality checks.",
    },
    {
      step: "05",
      title: "Delivery & Support",
      description: "You receive your deliverables with full documentation. We provide ongoing support for any questions or clarifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="grid-pattern h-full" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Scope of Work
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                Our Core <br />
                <span className="italic text-accent">Services</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed">
                From single-lot boundary surveys to complex infrastructure corridors, we offer comprehensive surveying services tailored to your specific needs.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-background relative z-10">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {services.map((service) => (
                <div 
                  key={service.number} 
                  className="border border-foreground/10 bg-popover"
                >
                  <div className="p-8 lg:p-12">
                    <div className="grid lg:grid-cols-12 gap-8">
                      {/* Left Column */}
                      <div className="lg:col-span-7">
                        <div className="flex items-start gap-6 mb-6">
                          <span className="font-mono text-5xl text-foreground/10 font-bold">{service.number}</span>
                          <div>
                            <h3 className="font-serif text-3xl text-foreground mb-2">{service.title}</h3>
                            <div className="font-mono text-xs text-accent tracking-widest uppercase">{service.subtitle}</div>
                          </div>
                        </div>
                        <p className="text-foreground/60 text-lg leading-relaxed mb-8">{service.description}</p>
                        
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="text-foreground/70">{service.timeline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent" />
                            <span className="text-foreground/70">{service.idealFor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Deliverables */}
                      <div className="lg:col-span-5 bg-secondary/30 p-6 border border-foreground/5">
                        <div className="font-mono text-xs text-foreground/40 mb-4 tracking-widest uppercase flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Deliverables
                        </div>
                        <ul className="space-y-3">
                          {service.deliverables.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-foreground/70">
                              <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                How We Work
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
                Our <span className="italic text-background/80">Process</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="font-mono text-6xl text-background/10 font-bold mb-4">{item.step}</div>
                  <h3 className="font-serif text-xl text-background mb-3">{item.title}</h3>
                  <p className="text-background/60 text-sm leading-relaxed">{item.description}</p>
                  
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8">
                      <ArrowRight className="w-6 h-6 text-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Note */}
        <section className="py-16 bg-accent text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                Transparent Pricing
              </h3>
              <p className="text-white/80 mb-6">
                Every project is unique. We provide detailed proposals with clear pricing based on area, complexity, accuracy requirements, and deliverables. No hidden fees, no surprises.
              </p>
              <div className="font-mono text-sm text-white/60">
                Contact us for a customized quotation for your project.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                  Common Questions
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                  Frequently <span className="italic text-accent">Asked</span>
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    q: "How long does a typical boundary survey take?",
                    a: "Most residential boundary surveys are completed within 2-5 working days, including field work and report preparation. Larger or more complex properties may require additional time.",
                  },
                  {
                    q: "What documents do I need to provide?",
                    a: "We typically need your property deed/title documents, any existing survey plans, and revenue records (7/12 extract). We can assist in obtaining records if needed.",
                  },
                  {
                    q: "Are your surveys legally valid?",
                    a: "Yes. All our surveys are conducted by government-licensed surveyors and comply with relevant regulations. Our reports are accepted by courts, revenue departments, and financial institutions.",
                  },
                  {
                    q: "Do you work outside Gujarat?",
                    a: "While our primary service area is Gujarat, we undertake projects across India for larger clients. Additional mobilization charges may apply for distant locations.",
                  },
                ].map((faq) => (
                  <div key={faq.q} className="border border-foreground/10 p-6">
                    <h4 className="font-serif text-lg text-foreground mb-3">{faq.q}</h4>
                    <p className="text-foreground/60">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-popover border-t border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                Ready to Get <span className="italic text-accent">Started</span>?
              </h2>
              <p className="text-foreground/60 text-lg mb-8">
                Tell us about your project and we will provide a detailed proposal within 24 hours. No obligation, no pressure.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group"
              >
                Request a Quote
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

export default Services;
