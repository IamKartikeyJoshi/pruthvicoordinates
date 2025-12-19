import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Crosshair, 
  Satellite, 
  Camera, 
  Map, 
  Ruler, 
  FileCheck,
  Shield,
  Award,
  CheckCircle
} from "lucide-react";

const Expertise = () => {
  const equipment = [
    {
      name: "Leica TS16 Total Station",
      category: "Precision Measurement",
      accuracy: "1″ Angular, 1mm + 1.5ppm Distance",
      description: "Our flagship total stations deliver sub-millimeter precision for boundary surveys, construction layout, and monitoring applications.",
      icon: Crosshair,
    },
    {
      name: "Trimble R12i GNSS Receiver",
      category: "Satellite Positioning",
      accuracy: "8mm Horizontal, 15mm Vertical",
      description: "RTK-enabled GNSS receivers provide real-time positioning across vast areas, essential for DGPS control surveys and geodetic networks.",
      icon: Satellite,
    },
    {
      name: "DJI Matrice 300 RTK",
      category: "Aerial Surveying",
      accuracy: "1cm Absolute Positioning",
      description: "Professional-grade drones equipped with RTK modules and high-resolution cameras for photogrammetric surveys and 3D modeling.",
      icon: Camera,
    },
    {
      name: "Leica Sprinter Digital Level",
      category: "Elevation Measurement",
      accuracy: "0.3mm per km Double Run",
      description: "Digital leveling for precise elevation data, essential for contour mapping, drainage analysis, and construction monitoring.",
      icon: Ruler,
    },
  ];

  const methodologies = [
    {
      number: "01",
      title: "Cadastral Surveying",
      description: "Legal boundary determination using a combination of historical records research, field measurements, and monument recovery. Our cadastral surveys are court-admissible and accepted by all government revenue departments.",
      applications: ["Property Boundary Disputes", "Land Registration", "Subdivision Planning", "Estate Settlement"],
    },
    {
      number: "02",
      title: "Topographical Mapping",
      description: "Comprehensive three-dimensional representation of terrain features including elevation contours, natural features, and man-made structures. Essential base data for architects, engineers, and planners.",
      applications: ["Site Planning", "Drainage Analysis", "Cut-Fill Calculations", "Landscape Design"],
    },
    {
      number: "03",
      title: "DGPS Control Networks",
      description: "Establishment of high-precision geodetic control points using differential GPS techniques. These networks provide the reference framework for all subsequent survey work in a project area.",
      applications: ["Large Infrastructure Projects", "Municipal Mapping", "Corridor Surveys", "Reference Networks"],
    },
    {
      number: "04",
      title: "Drone Photogrammetry",
      description: "Aerial image capture and processing to generate orthomosaics, digital elevation models, and 3D point clouds. Ideal for large areas where traditional methods would be time-prohibitive.",
      applications: ["Mining Volumetrics", "Agricultural Mapping", "Progress Monitoring", "Stockpile Measurement"],
    },
    {
      number: "05",
      title: "Construction Stakeout",
      description: "Precise transfer of design coordinates to the physical site for construction guidance. We ensure that foundations, utilities, and structures are positioned exactly as designed.",
      applications: ["Building Layout", "Road Alignment", "Utility Installation", "Bridge Construction"],
    },
    {
      number: "06",
      title: "As-Built Documentation",
      description: "Post-construction surveys that capture the actual positions and dimensions of completed work. Critical for compliance verification, facility management, and future modifications.",
      applications: ["Compliance Verification", "Facility Management", "BIM Integration", "Quality Assurance"],
    },
  ];

  const certifications = [
    { name: "Government Licensed Surveyor", authority: "Revenue Department, Gujarat", icon: Shield },
    { name: "ISO 9001:2015 Certified", authority: "Quality Management Systems", icon: Award },
    { name: "RERA Registered", authority: "Real Estate Regulatory Authority", icon: FileCheck },
    { name: "PWD Approved Contractor", authority: "Public Works Department", icon: CheckCircle },
  ];

  const software = [
    "AutoCAD Civil 3D",
    "Leica Infinity",
    "Trimble Business Center",
    "Pix4D Mapper",
    "Global Mapper",
    "QGIS",
    "ArcGIS Pro",
    "CloudCompare",
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="grid-pattern h-full" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Technical Expertise
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
                Instruments of <br />
                <span className="italic text-accent">Truth</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed">
                Our commitment to accuracy is backed by state-of-the-art equipment, proven methodologies, and continuous professional development. When precision matters, we deliver.
              </p>
            </div>
          </div>
        </section>

        {/* Equipment Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Our Arsenal
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                Survey-Grade <br />
                <span className="italic text-accent">Equipment</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {equipment.map((item) => (
                <div key={item.name} className="bg-popover p-8 border border-foreground/10 hover:border-accent transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="font-mono text-xs text-accent tracking-widest uppercase mb-2">{item.category}</div>
                      <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{item.name}</h3>
                    </div>
                    <item.icon className="w-10 h-10 text-foreground/20 group-hover:text-accent transition-colors" />
                  </div>
                  <p className="text-foreground/60 leading-relaxed mb-4">{item.description}</p>
                  <div className="font-mono text-sm bg-foreground/5 px-4 py-2 inline-block">
                    <span className="text-foreground/40">Accuracy: </span>
                    <span className="text-accent">{item.accuracy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodologies Section */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                Methodologies
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
                Scientific <br />
                <span className="italic text-background/80">Approaches</span>
              </h2>
              <p className="text-background/60 mt-6 max-w-2xl text-lg">
                Every project demands a tailored approach. We select and combine methodologies based on accuracy requirements, site conditions, and project objectives.
              </p>
            </div>

            <div className="space-y-6">
              {methodologies.map((method) => (
                <div key={method.number} className="bg-background/5 p-8 border border-background/10 hover:border-accent transition-all duration-300">
                  <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-1">
                      <span className="font-mono text-4xl text-background/20 font-bold">{method.number}</span>
                    </div>
                    <div className="lg:col-span-7">
                      <h3 className="font-serif text-2xl text-background mb-4">{method.title}</h3>
                      <p className="text-background/60 leading-relaxed">{method.description}</p>
                    </div>
                    <div className="lg:col-span-4">
                      <div className="font-mono text-xs text-accent mb-3 tracking-widest uppercase">Applications</div>
                      <ul className="space-y-2">
                        {method.applications.map((app) => (
                          <li key={app} className="text-background/70 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Software & Tools */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                  Software Stack
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                  Data Processing <br />
                  <span className="italic text-accent">Excellence</span>
                </h2>
                <p className="text-foreground/60 text-lg leading-relaxed mb-8">
                  Raw field data is only as valuable as the processing behind it. We utilize industry-leading software for data reduction, analysis, and deliverable generation.
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Our workflow integrates seamlessly with client systems, supporting standard CAD formats, GIS databases, and BIM platforms. We deliver data in whatever format your project requires.
                </p>
              </div>

              <div className="bg-popover p-8 border border-foreground/10">
                <div className="font-mono text-xs text-foreground/40 mb-6 tracking-widest uppercase">Software Proficiency</div>
                <div className="grid grid-cols-2 gap-4">
                  {software.map((sw) => (
                    <div key={sw} className="flex items-center gap-3 py-2 border-b border-foreground/5">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-foreground/80 font-mono text-sm">{sw}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Credentials
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Licensed & <span className="italic text-accent">Certified</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <div key={cert.name} className="text-center p-8 border border-foreground/10 hover:border-accent transition-colors group">
                  <cert.icon className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-serif text-lg text-foreground mb-2">{cert.name}</h3>
                  <div className="font-mono text-xs text-foreground/50">{cert.authority}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="py-24 bg-popover border-y border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                  Quality Assurance
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                  Our <span className="italic text-accent">Guarantee</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="font-serif text-5xl text-accent mb-4">100%</div>
                  <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">Data Verification</div>
                  <p className="text-foreground/60 text-sm">Every measurement is independently verified before delivery</p>
                </div>
                <div className="text-center">
                  <div className="font-serif text-5xl text-accent mb-4">24hr</div>
                  <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">Error Resolution</div>
                  <p className="text-foreground/60 text-sm">Any discrepancies addressed within one business day</p>
                </div>
                <div className="text-center">
                  <div className="font-serif text-5xl text-accent mb-4">10yr</div>
                  <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">Data Retention</div>
                  <p className="text-foreground/60 text-sm">All project records maintained for a full decade</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                Experience <span className="italic text-accent">Precision</span>
              </h2>
              <p className="text-foreground/60 text-lg mb-8">
                Discover how our technical capabilities can serve your project needs. Let us demonstrate why clients trust us with their most demanding survey requirements.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors group"
              >
                Discuss Your Project
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

export default Expertise;
