// Default content for all pages - used as fallback when no admin content exists
// Also used to pre-populate admin panel

export interface ContentItem {
  section_key: string;
  content: Record<string, any>;
  order_index: number;
  id?: string;
}

// ============ HOME PAGE ============
export const HOME_DEFAULTS: ContentItem[] = [
  // Stats
  { section_key: 'stat', order_index: 0, content: { value: '500+', label: 'Projects Completed', description: 'Across residential, commercial & infrastructure' } },
  { section_key: 'stat', order_index: 1, content: { value: '15+', label: 'Years Experience', description: 'Professional surveying expertise' } },
  { section_key: 'stat', order_index: 2, content: { value: '98%', label: 'Client Satisfaction', description: 'Precision and reliability guaranteed' } },
  { section_key: 'stat', order_index: 3, content: { value: '50+', label: 'Corporate Clients', description: 'Trusted by leading organizations' } },
  // Clients
  { section_key: 'client', order_index: 4, content: { name: 'Real Estate Developers', description: 'Land acquisition & site planning', icon: 'Building2' } },
  { section_key: 'client', order_index: 5, content: { name: 'Government Bodies', description: 'Infrastructure & municipal projects', icon: 'Landmark' } },
  { section_key: 'client', order_index: 6, content: { name: 'Industrial Sector', description: 'Factory layouts & compliance', icon: 'Factory' } },
  { section_key: 'client', order_index: 7, content: { name: 'Individual Landowners', description: 'Boundary disputes & documentation', icon: 'Home' } },
  { section_key: 'client', order_index: 8, content: { name: 'Agriculture', description: 'Farm mapping & land records', icon: 'TreePine' } },
  { section_key: 'client', order_index: 9, content: { name: 'Construction Companies', description: 'As-built & progress surveys', icon: 'Truck' } },
  // Process
  { section_key: 'process', order_index: 10, content: { number: '01', title: 'Consultation', description: 'Share your project requirements and we\'ll provide a detailed scope of work and quotation.', icon: 'ClipboardList' } },
  { section_key: 'process', order_index: 11, content: { number: '02', title: 'Field Survey', description: 'Our certified surveyors conduct precise measurements using state-of-the-art equipment.', icon: 'Compass' } },
  { section_key: 'process', order_index: 12, content: { number: '03', title: 'Data Processing', description: 'Raw data is processed, verified, and converted into detailed maps and reports.', icon: 'FileCheck' } },
  { section_key: 'process', order_index: 13, content: { number: '04', title: 'Delivery', description: 'Receive certified survey documents in digital and physical formats as required.', icon: 'Send' } },
  // Contact Info
  { section_key: 'contact_info', order_index: 14, content: { phone: '+91 98765 43210', email: 'info@pruthvisurvey.com' } },
];

// ============ MISSION PAGE ============
export const MISSION_DEFAULTS: ContentItem[] = [
  // Hero
  { section_key: 'hero', order_index: 0, content: { subtitle: 'Our Mission', title: 'Defined by', titleAccent: 'Precision', description: 'For over three decades, Pruthvi Co-ordinates has been the trusted name in land surveying across Gujarat. We translate the physical world into precise digital coordinates that define property rights, enable construction, and resolve disputes.' } },
  // Stats
  { section_key: 'stats', order_index: 1, content: { label: 'PROJECTS COMPLETED', value: '1,500+' } },
  { section_key: 'stats', order_index: 2, content: { label: 'YEARS EXPERIENCE', value: '34' } },
  { section_key: 'stats', order_index: 3, content: { label: 'CLIENT SATISFACTION', value: '100%' } },
  { section_key: 'stats', order_index: 4, content: { label: 'TEAM MEMBERS', value: '45+' } },
  // Philosophy
  { section_key: 'philosophy', order_index: 5, content: { title: 'The Art of Measurement', description: 'In our line of work, an inch is a mile. The difference between accurate and approximate can mean the difference between a successful development and a legal nightmare, between harmonious neighbors and bitter disputes.\n\nWe approach every project—whether a simple residential boundary or a complex infrastructure corridor—with the same unwavering commitment to precision. Our data does not merely describe the land; it defines it legally, practically, and permanently.\n\nThis philosophy has earned us the trust of government bodies, real estate developers, legal professionals, and thousands of individual property owners across Gujarat.', quote: 'We do not just measure land; we define boundaries that stand the test of time.', quoteName: 'Rajesh Patel', quoteRole: 'Founder & Principal Surveyor' } },
  // Values
  { section_key: 'value', order_index: 6, content: { number: '01', title: 'Precision Above All', description: 'In surveying, there is no room for approximation. Every measurement we take is verified, cross-checked, and documented to ensure absolute accuracy. Our reputation is built on the reliability of our data.' } },
  { section_key: 'value', order_index: 7, content: { number: '02', title: 'Integrity & Trust', description: 'We serve as impartial observers of the physical world. Our findings stand up in courts of law, government bodies, and financial institutions because we never compromise on honesty.' } },
  { section_key: 'value', order_index: 8, content: { number: '03', title: 'Innovation in Tradition', description: 'While we respect time-tested surveying methods, we continuously adopt cutting-edge technology. From drone photogrammetry to DGPS networks, we blend heritage with innovation.' } },
  // Milestones
  { section_key: 'milestone', order_index: 9, content: { year: '1989', event: 'Company founded in Ahmedabad with a single Total Station' } },
  { section_key: 'milestone', order_index: 10, content: { year: '1995', event: 'First government contract for municipal boundary demarcation' } },
  { section_key: 'milestone', order_index: 11, content: { year: '2003', event: 'Adopted GPS technology for large-scale surveys' } },
  { section_key: 'milestone', order_index: 12, content: { year: '2010', event: 'Expanded to serve all of Gujarat with 3 regional offices' } },
  { section_key: 'milestone', order_index: 13, content: { year: '2015', event: 'Introduced drone-based aerial surveying capabilities' } },
  { section_key: 'milestone', order_index: 14, content: { year: '2020', event: 'Completed landmark 1,000th project milestone' } },
  { section_key: 'milestone', order_index: 15, content: { year: '2023', event: 'Launched real-time kinematic (RTK) survey services' } },
  // Team
  { section_key: 'team', order_index: 16, content: { name: 'Vinay Joshi', role: 'Founder & Principal Surveyor', experience: '34 years', specialty: 'Cadastral & Legal Surveys', license: 'Govt. Licensed Surveyor #GJ-1989-042' } },
  { section_key: 'team', order_index: 17, content: { name: 'Amit Sharma', role: 'Technical Director', experience: '22 years', specialty: 'DGPS & Geodetic Networks', license: 'Certified Geodetic Surveyor' } },
  { section_key: 'team', order_index: 18, content: { name: 'Priya Mehta', role: 'Operations Manager', experience: '15 years', specialty: 'Project Coordination', license: 'PMP Certified' } },
  { section_key: 'team', order_index: 19, content: { name: 'Vikram Singh', role: 'Senior Survey Engineer', experience: '18 years', specialty: 'Infrastructure & Construction', license: 'Certified Civil Engineer' } },
];

// ============ EXPERTISE PAGE ============
export const EXPERTISE_DEFAULTS: ContentItem[] = [
  { section_key: 'hero', order_index: 0, content: { subtitle: 'Technical Expertise', title: 'Instruments of', titleAccent: 'Truth', description: 'Our commitment to accuracy is backed by state-of-the-art equipment, proven methodologies, and continuous professional development. When precision matters, we deliver.' } },
  // Equipment
  { section_key: 'equipment', order_index: 1, content: { name: 'Leica TS16 Total Station', category: 'Precision Measurement', accuracy: '1″ Angular, 1mm + 1.5ppm Distance', description: 'Our flagship total stations deliver sub-millimeter precision for boundary surveys, construction layout, and monitoring applications.', image_url: '' } },
  { section_key: 'equipment', order_index: 2, content: { name: 'Trimble R12i GNSS Receiver', category: 'Satellite Positioning', accuracy: '8mm Horizontal, 15mm Vertical', description: 'RTK-enabled GNSS receivers provide real-time positioning across vast areas, essential for DGPS control surveys and geodetic networks.', image_url: '' } },
  { section_key: 'equipment', order_index: 3, content: { name: 'DJI Matrice 300 RTK', category: 'Aerial Surveying', accuracy: '1cm Absolute Positioning', description: 'Professional-grade drones equipped with RTK modules and high-resolution cameras for photogrammetric surveys and 3D modeling.', image_url: '' } },
  { section_key: 'equipment', order_index: 4, content: { name: 'Leica Sprinter Digital Level', category: 'Elevation Measurement', accuracy: '0.3mm per km Double Run', description: 'Digital leveling for precise elevation data, essential for contour mapping, drainage analysis, and construction monitoring.', image_url: '' } },
  // Methodologies
  { section_key: 'methodology', order_index: 5, content: { title: 'Cadastral Surveying', description: 'Legal boundary determination using a combination of historical records research, field measurements, and monument recovery. Our cadastral surveys are court-admissible and accepted by all government revenue departments.', applications: 'Property Boundary Disputes,Land Registration,Subdivision Planning,Estate Settlement' } },
  { section_key: 'methodology', order_index: 6, content: { title: 'Topographical Mapping', description: 'Comprehensive three-dimensional representation of terrain features including elevation contours, natural features, and man-made structures. Essential base data for architects, engineers, and planners.', applications: 'Site Planning,Drainage Analysis,Cut-Fill Calculations,Landscape Design' } },
  { section_key: 'methodology', order_index: 7, content: { title: 'DGPS Control Networks', description: 'Establishment of high-precision geodetic control points using differential GPS techniques. These networks provide the reference framework for all subsequent survey work in a project area.', applications: 'Large Infrastructure Projects,Municipal Mapping,Corridor Surveys,Reference Networks' } },
  { section_key: 'methodology', order_index: 8, content: { title: 'Drone Photogrammetry', description: 'Aerial image capture and processing to generate orthomosaics, digital elevation models, and 3D point clouds. Ideal for large areas where traditional methods would be time-prohibitive.', applications: 'Mining Volumetrics,Agricultural Mapping,Progress Monitoring,Stockpile Measurement' } },
  { section_key: 'methodology', order_index: 9, content: { title: 'Construction Stakeout', description: 'Precise transfer of design coordinates to the physical site for construction guidance. We ensure that foundations, utilities, and structures are positioned exactly as designed.', applications: 'Building Layout,Road Alignment,Utility Installation,Bridge Construction' } },
  { section_key: 'methodology', order_index: 10, content: { title: 'As-Built Documentation', description: 'Post-construction surveys that capture the actual positions and dimensions of completed work. Critical for compliance verification, facility management, and future modifications.', applications: 'Compliance Verification,Facility Management,BIM Integration,Quality Assurance' } },
  // Software
  { section_key: 'software', order_index: 11, content: { name: 'AutoCAD Civil 3D' } },
  { section_key: 'software', order_index: 12, content: { name: 'Leica Infinity' } },
  { section_key: 'software', order_index: 13, content: { name: 'Trimble Business Center' } },
  { section_key: 'software', order_index: 14, content: { name: 'Pix4D Mapper' } },
  { section_key: 'software', order_index: 15, content: { name: 'Global Mapper' } },
  { section_key: 'software', order_index: 16, content: { name: 'QGIS' } },
  { section_key: 'software', order_index: 17, content: { name: 'ArcGIS Pro' } },
  { section_key: 'software', order_index: 18, content: { name: 'CloudCompare' } },
  // Certifications
  { section_key: 'certification', order_index: 19, content: { name: 'Government Licensed Surveyor', authority: 'Revenue Department, Gujarat' } },
  { section_key: 'certification', order_index: 20, content: { name: 'ISO 9001:2015 Certified', authority: 'Quality Management Systems' } },
  { section_key: 'certification', order_index: 21, content: { name: 'RERA Registered', authority: 'Real Estate Regulatory Authority' } },
  { section_key: 'certification', order_index: 22, content: { name: 'PWD Approved Contractor', authority: 'Public Works Department' } },
];

// ============ SERVICES PAGE ============
export const SERVICES_DEFAULTS: ContentItem[] = [
  { section_key: 'hero', order_index: 0, content: { subtitle: 'Scope of Work', title: 'Our Core', titleAccent: 'Services', description: 'From single-lot boundary surveys to complex infrastructure corridors, we offer comprehensive surveying services tailored to your specific needs.' } },
  // Services
  { section_key: 'service', order_index: 1, content: { title: 'Topographical Survey', subtitle: 'For Architects & Urban Planners', description: 'Comprehensive three-dimensional mapping of terrain, structures, and natural features.', deliverables: 'Detailed contour maps,Digital Terrain Model (DTM),Feature inventory with coordinates,Cross-sections and profiles,AutoCAD and GIS-compatible files', timeline: '3-10 working days', idealFor: 'Architects, Civil Engineers, Urban Planners' } },
  { section_key: 'service', order_index: 2, content: { title: 'Boundary Demarcation', subtitle: 'Legal Boundary Identification', description: 'Precise identification and physical marking of property boundaries based on title documents, revenue records, and field evidence.', deliverables: 'Boundary survey report,Physical boundary markers,Area calculation certificate,Revenue records comparison,Photographic documentation', timeline: '2-5 working days', idealFor: 'Property Owners, Real Estate Developers' } },
  { section_key: 'service', order_index: 3, content: { title: 'Plotting & Layout', subtitle: 'Subdivision & Infrastructure Marking', description: 'Transfer of approved plans to the physical site for construction guidance.', deliverables: 'Physical stakes/markers,As-staked coordinate report,Deviation report,Reference benchmark,Progress verification', timeline: '1-3 working days', idealFor: 'Construction Companies, Municipal Bodies' } },
  { section_key: 'service', order_index: 4, content: { title: 'DGPS Control Survey', subtitle: 'Geodetic Network Establishment', description: 'Establishment of high-precision control networks using Differential GPS technology.', deliverables: 'Control point coordinate list,Network adjustment report,Physical monument installation,Transformation parameters,Quality metrics', timeline: '5-15 working days', idealFor: 'Infrastructure Projects, Large Developments' } },
  { section_key: 'service', order_index: 5, content: { title: 'As-Built Survey', subtitle: 'Construction Verification & Documentation', description: 'Post-construction surveys capturing the actual positions and dimensions of completed work.', deliverables: 'As-built drawings in CAD,Comparison with design,Deviation report,3D model,BIM integration files', timeline: '3-7 working days', idealFor: 'Construction Companies, Facility Managers' } },
  // Process
  { section_key: 'process', order_index: 6, content: { step: '01', title: 'Initial Consultation', description: 'We discuss your project requirements, review available documents, and understand your accuracy needs and timeline constraints.' } },
  { section_key: 'process', order_index: 7, content: { step: '02', title: 'Proposal & Agreement', description: 'You receive a detailed proposal outlining scope, methodology, deliverables, timeline, and cost.' } },
  { section_key: 'process', order_index: 8, content: { step: '03', title: 'Field Survey', description: 'Our team conducts the field work using appropriate equipment and methodologies.' } },
  { section_key: 'process', order_index: 9, content: { step: '04', title: 'Data Processing', description: 'Raw field data is processed, verified, and transformed into the required deliverable formats.' } },
  { section_key: 'process', order_index: 10, content: { step: '05', title: 'Delivery & Support', description: 'You receive your deliverables with full documentation and ongoing support.' } },
  // FAQs
  { section_key: 'faq', order_index: 11, content: { question: 'How long does a typical boundary survey take?', answer: 'Most residential boundary surveys are completed within 2-5 working days, including field work and report preparation.' } },
  { section_key: 'faq', order_index: 12, content: { question: 'What documents do I need to provide?', answer: 'We typically need your property deed/title documents, any existing survey plans, and revenue records (7/12 extract).' } },
  { section_key: 'faq', order_index: 13, content: { question: 'Are your surveys legally valid?', answer: 'Yes. All our surveys are conducted by government-licensed surveyors and comply with relevant regulations.' } },
  { section_key: 'faq', order_index: 14, content: { question: 'Do you work outside Gujarat?', answer: 'While our primary service area is Gujarat, we undertake projects across India for larger clients.' } },
];

// ============ PORTFOLIO PAGE ============
export const PORTFOLIO_DEFAULTS: ContentItem[] = [
  { section_key: 'hero', order_index: 0, content: { subtitle: 'Selected Works', title: 'Mapping the', titleAccent: 'Infrastructure', description: 'From iconic landmarks to essential infrastructure, our surveys have shaped Gujarat development story. Explore our portfolio of precision work.' } },
  // Projects
  { section_key: 'project', order_index: 1, content: { title: 'Sabarmati Riverfront Development', category: 'Infrastructure', location: 'Ahmedabad, Gujarat', year: '2018-2022', area: '11.5 km corridor', description: 'Comprehensive topographical and control survey for the iconic Sabarmati Riverfront Development project.', services: 'DGPS Control Network,Topographical Survey,As-Built Documentation,Progress Monitoring', highlight: 'Zero-deviation from design specifications throughout 4-year project', image_url: '' } },
  { section_key: 'project', order_index: 2, content: { title: 'GIFT City Master Plan Survey', category: 'Urban Development', location: 'Gandhinagar, Gujarat', year: '2019-2021', area: '886 acres', description: 'Complete cadastral and topographical survey for Gujarat International Finance Tec-City (GIFT City).', services: 'Cadastral Survey,Plot Demarcation,Control Network,GIS Database', highlight: 'Served as official survey record for all land transactions in GIFT City', image_url: '' } },
  { section_key: 'project', order_index: 3, content: { title: 'Mundra Port Expansion', category: 'Industrial', location: 'Kutch, Gujarat', year: '2020', area: '450 hectares', description: 'Large-scale topographical survey and bathymetric mapping for Adani Port expansion project.', services: 'Drone Photogrammetry,Bathymetric Survey,Volume Calculations,Progress Monitoring', highlight: 'Completed 450-hectare survey in just 21 days using drone technology', image_url: '' } },
  // Categories
  { section_key: 'category', order_index: 4, content: { name: 'Residential & Commercial', count: '450+', description: 'Boundary surveys, plot layouts, and construction stakeout for housing societies and commercial complexes.', projects: 'Godrej Garden City,Iscon Platinum,Shela Township,Sindhu Bhavan Road Hub' } },
  { section_key: 'category', order_index: 5, content: { name: 'Infrastructure & Roads', count: '180+', description: 'Route surveys, corridor mapping, and as-built documentation for highways and metro rail.', projects: 'Ahmedabad Metro Phase-1,NH-48 Bypass,BRTS Corridor,Ring Road Widening' } },
  { section_key: 'category', order_index: 6, content: { name: 'Industrial & Mining', count: '120+', description: 'Site surveys, volumetric calculations, and progress monitoring for industrial facilities.', projects: 'Essar Steel Plant,Ambuja Cement Quarry,GIDC Industrial Estate,Solar Park Assessment' } },
  { section_key: 'category', order_index: 7, content: { name: 'Government & Municipal', count: '250+', description: 'Revenue surveys, municipal mapping, and official demarcation for government bodies.', projects: 'AMC Ward Boundary,Village Map Digitization,Revenue Record Verification,Smart City GIS' } },
  // Clients
  { section_key: 'client', order_index: 8, content: { name: 'Adani Group', type: 'Corporate' } },
  { section_key: 'client', order_index: 9, content: { name: 'Godrej Properties', type: 'Real Estate' } },
  { section_key: 'client', order_index: 10, content: { name: 'L&T Construction', type: 'Infrastructure' } },
  { section_key: 'client', order_index: 11, content: { name: 'Gujarat Government', type: 'Government' } },
  { section_key: 'client', order_index: 12, content: { name: 'Ahmedabad Municipal Corporation', type: 'Municipal' } },
  { section_key: 'client', order_index: 13, content: { name: 'NHAI', type: 'Government' } },
  { section_key: 'client', order_index: 14, content: { name: 'Torrent Power', type: 'Utility' } },
  { section_key: 'client', order_index: 15, content: { name: 'Zydus Cadila', type: 'Pharmaceutical' } },
  // Testimonials
  { section_key: 'testimonial', order_index: 16, content: { quote: 'Pruthvi Co-ordinates has been our go-to surveyor for over a decade. Their accuracy and professionalism are unmatched in the industry.', author: 'Rakesh Mehta', position: 'Project Director, L&T Infrastructure' } },
  { section_key: 'testimonial', order_index: 17, content: { quote: 'The boundary survey they conducted helped us resolve a long-standing dispute. Their documentation was accepted without question by the revenue tribunal.', author: 'Advocate Suresh Patel', position: 'Property Law Specialist' } },
  { section_key: 'testimonial', order_index: 18, content: { quote: 'Fast, accurate, and always available when we need them. We have relied on their surveys for all our township projects.', author: 'Nitin Shah', position: 'VP Operations, Goyal Group' } },
];

export const PAGE_DEFAULTS: Record<string, ContentItem[]> = {
  home: HOME_DEFAULTS,
  mission: MISSION_DEFAULTS,
  expertise: EXPERTISE_DEFAULTS,
  services: SERVICES_DEFAULTS,
  portfolio: PORTFOLIO_DEFAULTS,
};
