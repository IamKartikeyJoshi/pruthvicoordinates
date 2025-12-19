import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Target, Users, Clock, Shield, Compass } from "lucide-react";

const Mission = () => {
  const stats = [
    { label: "PROJECTS COMPLETED", value: "1,500+", icon: Target },
    { label: "YEARS EXPERIENCE", value: "34", icon: Clock },
    { label: "CLIENT SATISFACTION", value: "100%", icon: Award },
    { label: "TEAM MEMBERS", value: "45+", icon: Users },
  ];

  const values = [
    {
      number: "01",
      title: "Precision Above All",
      description: "In surveying, there is no room for approximation. Every measurement we take is verified, cross-checked, and documented to ensure absolute accuracy. Our reputation is built on the reliability of our data.",
      icon: Target,
    },
    {
      number: "02",
      title: "Integrity & Trust",
      description: "We serve as impartial observers of the physical world. Our findings stand up in courts of law, government bodies, and financial institutions because we never compromise on honesty.",
      icon: Shield,
    },
    {
      number: "03",
      title: "Innovation in Tradition",
      description: "While we respect time-tested surveying methods, we continuously adopt cutting-edge technology. From drone photogrammetry to DGPS networks, we blend heritage with innovation.",
      icon: Compass,
    },
  ];

  const team = [
    {
      name: "Vinay Joshi",
      role: "Founder & Principal Surveyor",
      experience: "34 years",
      specialty: "Cadastral & Legal Surveys",
      license: "Govt. Licensed Surveyor #GJ-1989-042",
    },
    {
      name: "Amit Sharma",
      role: "Technical Director",
      experience: "22 years",
      specialty: "DGPS & Geodetic Networks",
      license: "Certified Geodetic Surveyor",
    },
    {
      name: "Priya Mehta",
      role: "Operations Manager",
      experience: "15 years",
      specialty: "Project Coordination",
      license: "PMP Certified",
    },
    {
      name: "Vikram Singh",
      role: "Senior Survey Engineer",
      experience: "18 years",
      specialty: "Infrastructure & Construction",
      license: "Certified Civil Engineer",
    },
  ];

  const milestones = [
    { year: "1989", event: "Company founded in Ahmedabad with a single Total Station" },
    { year: "1995", event: "First government contract for municipal boundary demarcation" },
    { year: "2003", event: "Adopted GPS technology for large-scale surveys" },
    { year: "2010", event: "Expanded to serve all of Gujarat with 3 regional offices" },
    { year: "2015", event: "Introduced drone-based aerial surveying capabilities" },
    { year: "2020", event: "Completed landmark 1,000th project milestone" },
    { year: "2023", event: "Launched real-time kinematic (RTK) survey services" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden page-bg">
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
                Our Mission
              </h3>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-background mb-8">
                Defined by <br />
                <span className="italic text-background/80">Precision</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-background/70 max-w-2xl leading-relaxed">
                For over three decades, Pruthvi Co-ordinates has been the trusted name in land surveying across Gujarat. We translate the physical world into precise digital coordinates that define property rights, enable construction, and resolve disputes.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 text-accent mx-auto mb-4" />
                  <div className="font-serif text-4xl md:text-5xl text-foreground mb-2">{stat.value}</div>
                  <div className="font-mono text-xs tracking-widest text-foreground/50 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                  Our Philosophy
                </h3>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
                  The Art of <br />
                  <span className="italic text-accent">Measurement</span>
                </h2>
                <div className="space-y-6 text-foreground/70 text-lg leading-relaxed">
                  <p>
                    In our line of work, an inch is a mile. The difference between accurate and approximate can mean the difference between a successful development and a legal nightmare, between harmonious neighbors and bitter disputes.
                  </p>
                  <p>
                    We approach every project—whether a simple residential boundary or a complex infrastructure corridor—with the same unwavering commitment to precision. Our data does not merely describe the land; it defines it legally, practically, and permanently.
                  </p>
                  <p>
                    This philosophy has earned us the trust of government bodies, real estate developers, legal professionals, and thousands of individual property owners across Gujarat.
                  </p>
                </div>
              </div>

              <div className="bg-popover p-8 border border-foreground/10">
                <blockquote className="font-serif text-2xl md:text-3xl text-foreground italic leading-relaxed mb-6">
                  "We do not just measure land; we define boundaries that stand the test of time."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center font-serif text-2xl text-accent">
                    RP
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Rajesh Patel</div>
                    <div className="font-mono text-xs text-foreground/50">Founder & Principal Surveyor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Core Values
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                What We <br />
                <span className="italic text-accent">Stand For</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.number} className="bg-popover p-8 border-l-4 border-accent hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-4xl text-foreground/10 font-bold">{value.number}</span>
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-4">{value.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/40 mb-4 uppercase">
                Our Journey
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                34 Years of <br />
                <span className="italic text-accent">Excellence</span>
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 transform md:-translate-x-1/2" />
              
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-8 md:pl-0`}>
                    <div className="font-mono text-accent text-sm tracking-widest mb-2">{milestone.year}</div>
                    <p className="text-foreground/70 text-lg">{milestone.event}</p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-accent rounded-full transform -translate-x-1/2 border-4 border-background" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h3 className="font-mono text-xs font-bold tracking-widest text-accent mb-4 uppercase">
                Leadership Team
              </h3>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
                The Experts <br />
                <span className="italic text-background/80">Behind the Data</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="border border-background/20 p-6 hover:border-accent transition-colors group">
                  <div className="w-20 h-20 bg-background/10 rounded-full flex items-center justify-center font-serif text-2xl text-accent mb-6 group-hover:bg-accent/20 transition-colors">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="font-serif text-xl text-background mb-1">{member.name}</h3>
                  <div className="font-mono text-xs text-accent mb-4">{member.role}</div>
                  <div className="space-y-2 text-sm text-background/60">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="text-background/80">{member.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Specialty:</span>
                      <span className="text-background/80">{member.specialty}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-background/10 font-mono text-[10px] text-background/40">
                    {member.license}
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
                Ready to Work with <span className="italic text-accent">Precision</span>?
              </h2>
              <p className="text-foreground/60 text-lg mb-8">
                Whether you need boundary demarcation, topographical surveys, or complex geodetic networks, our team is ready to deliver results you can trust.
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

export default Mission;
