/**
 * catalogV3 — V3 catalogue migration for InnoSpeak Global.
 *
 * Applies field updates to existing courses, removes deprecated ones,
 * marks replacements as coming soon, and adds all new V3 courses.
 * New courses use groupingCode (e.g. ACP-DSP, LT-SWE) which maps to the existing
 * pathwayId values that the rest of the codebase reads.
 */

const ACADEMY = 'InnoSpeak Academy';
const LABS = 'InnoSpeak Labs';

export const GROUPING_TO_PATHWAY = {
  'ACP-ENG': 'global-language',
  'ACP-WLD': 'languages',
  'ACP-IQU': 'international-qualifications',
  'ACP-KCV': 'national-tvet',
  'ACP-DSP': 'digital-literacy-productivity',
  'ACP-CDM': 'creative-design',
  'ACP-BUS': 'business',
  'ACP-FRW': 'freelancing',
  'ACP-CGO': 'career',
  'ACP-ETT': 'education-teaching-excellence',
  'ACP-HHC': 'health-hospitality-community',
  'ACP-PLS': 'personal-development-life-skills',
  'LT-SWE': 'school-software-engineering',
  'LT-DAT': 'school-data-science',
  'LT-AIS': 'school-ai',
  'LT-CLD': 'school-cloud-devops',
  'LT-CYB': 'school-cybersecurity',
  'LT-ENG': 'school-engineering-innovation',
  'LT-CRT': 'school-creative-ai-immersive',
};

const PATHWAY_TO_CATEGORY = {
  'global-language': 'Global Languages & Communication',
  'languages': 'World Languages',
  'international-qualifications': 'International Qualifications',
  'national-tvet': 'National Curriculum & TVET',
  'digital-literacy-productivity': 'Digital Literacy & Productivity',
  'creative-design': 'Creative Design & Media',
  'business': 'Business, Entrepreneurship & Leadership',
  'freelancing': 'Freelancing & Remote Work',
  'career': 'Career Development',
  'education-teaching-excellence': 'Education & Teaching Excellence',
  'health-hospitality-community': 'Health, Hospitality & Community Development',
  'personal-development-life-skills': 'Personal Development & Life Skills',
  'school-software-engineering': 'Software & Digital Systems',
  'school-data-science': 'Data, Analytics & Intelligent Systems',
  'school-ai': 'Digital Intelligence',
  'school-cloud-devops': 'Cloud, Infrastructure & DevOps',
  'school-cybersecurity': 'Cybersecurity & Digital Safety',
  'school-engineering-innovation': 'Engineering, Automation & Innovation',
  'school-creative-ai-immersive': 'Creative Technology & Immersive Media',
};

const DEFAULT_INSTRUCTOR = { name: 'To be announced', bio: 'Instructor details will be confirmed before intake.' };

function feesDisplay(course) {
  if (course.isFree || course.feesUSD === 0) return 'Free';
  return `USD ${course.feesUSD}`;
}

function normalizeNewCourse(c) {
  const pathwayId = GROUPING_TO_PATHWAY[c.groupingCode] || c.groupingCode;
  const pillar = c.division || 'academy';
  const academy = pillar === 'labs' ? LABS : ACADEMY;
  const category = PATHWAY_TO_CATEGORY[pathwayId] || c.groupingCode;

  return {
    code: c.code,
    name: c.name,
    academy,
    pathwayId,
    category,
    pillar,
    groupingCode: c.groupingCode,
    division: c.division,
    shortDescription: c.shortDescription,
    fullDescription: c.fullDescription,
    duration: c.duration,
    studyMode: c.studyMode,
    level: c.level,
    levelBand: c.levelBand,
    language: c.language,
    fees: feesDisplay(c),
    feesUSD: c.feesUSD,
    isFree: c.isFree,
    certificatePriceUSD: c.certificatePriceUSD || 0,
    certification: c.certification,
    entryRequirements: c.entryRequirements || [],
    instructor: DEFAULT_INSTRUCTOR,
    brochureUrl: '#',
    calendarUrl: '#',
    featuredImage: null,
    featured: c.featured || false,
    marketability: c.marketability,
    createdAt: c.createdAt || '2026-09-01',
  };
}

export const NEW_COURSES = [
  { code: 'AI-LIT-01', name: 'AI Literacy for Work', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-DSP', level: 'Foundation', levelBand: 'Foundation', duration: '4 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Understand AI tools, their limits and how to use them responsibly at work.', fullDescription: 'AI Literacy for Work introduces learners to AI concepts, common tools, ethical use and practical workplace applications. No technical background required.', feesUSD: 0, isFree: true, certificatePriceUSD: 5, marketability: 'high', featured: true, certification: 'InnoSpeak AI Literacy Certificate', entryRequirements: ['Basic computer literacy','Access to a computer with internet'], createdAt: '2026-09-01' },
  { code: 'PDS108', name: 'Analytical Thinking for Professionals', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-PLS', level: 'Intermediate', levelBand: 'Practitioner', duration: '4 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build the #1 most sought-after core skill in the global workforce.', fullDescription: 'Analytical Thinking for Professionals develops structured reasoning, data interpretation, evidence evaluation and decision-making frameworks used in professional environments.', feesUSD: 12, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Analytical Thinking Certificate', entryRequirements: ['Basic English literacy','Access to a computer with internet'], createdAt: '2026-09-01' },
  { code: 'PDS109', name: 'Resilience & Adaptability', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-PLS', level: 'Beginner', levelBand: 'Foundation', duration: '3 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Develop the resilience and agility employers rank among the top human skills.', fullDescription: 'Resilience & Adaptability covers stress management, growth mindset, change navigation and building sustainable work habits for a rapidly changing workplace.', feesUSD: 10, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Resilience Certificate', entryRequirements: ['Basic English literacy'], createdAt: '2026-09-01' },
  { code: 'BUS110', name: 'AI for Business Owners', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-BUS', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Use AI tools to run a smarter, more efficient business.', fullDescription: 'AI for Business Owners teaches practical AI application across operations, marketing, customer service, finance and product — tailored for SME owners and founders.', feesUSD: 20, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak AI for Business Certificate', entryRequirements: ['Basic business knowledge','Access to a computer with internet'], createdAt: '2026-09-01' },
  { code: 'ECM101', name: 'Ecommerce Management', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-FRW', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Manage online stores and digital commerce operations for global clients.', fullDescription: 'Ecommerce Management covers product listings, order management, customer service, marketplace operations and analytics across Shopify, Amazon and Jumia.', feesUSD: 15, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Ecommerce Certificate', entryRequirements: ['Basic computer literacy','Basic English literacy'], createdAt: '2026-09-01' },
  { code: 'AIV101', name: 'AI Video Generation & Editing', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-CDM', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Master the fastest-growing skill in the global freelance market (+329% YoY).', fullDescription: 'AI Video Generation & Editing teaches Runway, Sora, Pika, CapCut AI and Premiere Pro AI features for producing professional video content at scale.', feesUSD: 22, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak AI Video Certificate', entryRequirements: ['Basic computer literacy','Access to a computer with internet'], createdAt: '2026-09-01' },
  { code: 'AII101', name: 'AI Image Generation & Editing', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-CDM', level: 'Beginner', levelBand: 'Foundation', duration: '4 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Create professional visuals using AI tools like Midjourney, DALL·E and Firefly.', fullDescription: 'AI Image Generation & Editing covers prompt design, style control, inpainting, upscaling and integration with Photoshop for professional creative workflows.', feesUSD: 18, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak AI Image Certificate', entryRequirements: ['Basic computer literacy','Access to a computer with internet'], createdAt: '2026-09-01' },
  { code: 'CRD108', name: 'AI Interview Preparation', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-CGO', level: 'Beginner', levelBand: 'Foundation', duration: '3 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Use AI tools to practise and perfect your interview technique.', fullDescription: 'AI Interview Preparation uses AI mock interview tools, feedback analysis and role-specific question banks to prepare learners for competitive interviews.', feesUSD: 10, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Interview Prep Certificate', entryRequirements: ['Basic English proficiency'], createdAt: '2026-09-01' },
  { code: 'EDT111', name: 'Philosophy of Education', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-ETT', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'Explore foundational philosophies that shape teaching and learning.', fullDescription: 'Philosophy of Education examines educational thinkers, purpose of education, ethics in teaching and philosophical foundations of modern pedagogy.', feesUSD: 18, isFree: false, certificatePriceUSD: 0, marketability: 'medium', featured: false, certification: 'InnoSpeak Certificate in Philosophy of Education', entryRequirements: ['Teaching experience or interest in education'], createdAt: '2026-09-01' },
  { code: 'EDT112', name: 'Educational Psychology', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-ETT', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'Understand how learners think, develop and learn.', fullDescription: 'Educational Psychology covers learning theories, cognitive development, motivation, individual differences and applying psychology in classroom and online settings.', feesUSD: 18, isFree: false, certificatePriceUSD: 0, marketability: 'medium', featured: false, certification: 'InnoSpeak Certificate in Educational Psychology', entryRequirements: ['Teaching experience or interest in education'], createdAt: '2026-09-01' },
  { code: 'EDT113', name: 'Sociology of Education', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-ETT', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'Examine how society shapes education and education shapes society.', fullDescription: 'Sociology of Education covers social class, gender, culture, equality and the role of education in society, with focus on African and Kenyan contexts.', feesUSD: 18, isFree: false, certificatePriceUSD: 0, marketability: 'medium', featured: false, certification: 'InnoSpeak Certificate in Sociology of Education', entryRequirements: ['Teaching experience or interest in education'], createdAt: '2026-09-01' },
  { code: 'EDT114', name: 'Training Methodologies', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-ETT', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'Master training design and delivery for adult and technical learners.', fullDescription: 'Training Methodologies covers adult learning principles, training needs analysis, session design, delivery techniques and evaluation for trainers and instructors.', feesUSD: 20, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Training Methodologies Certificate', entryRequirements: ['Teaching or training experience'], createdAt: '2026-09-01' },
  { code: 'EDT115', name: 'Workshop Planning & Management', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-ETT', level: 'Intermediate', levelBand: 'Practitioner', duration: '5 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'Plan, run and evaluate effective training workshops.', fullDescription: 'Workshop Planning & Management covers workshop design, logistics, facilitation, participant engagement, resource management and post-workshop evaluation.', feesUSD: 18, isFree: false, certificatePriceUSD: 0, marketability: 'medium', featured: false, certification: 'InnoSpeak Workshop Management Certificate', entryRequirements: ['Teaching or training experience'], createdAt: '2026-09-01' },
  { code: 'HSP108', name: 'Front Office Operations', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-HHC', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'ILO-validated curriculum for hospitality front-office roles.', fullDescription: 'Front Office Operations covers reservations, check-in/out, guest relations, communication and hospitality software — aligned with ILO Kenya hospitality standards.', feesUSD: 20, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Front Office Certificate', entryRequirements: ['Basic English literacy'], createdAt: '2026-09-01' },
  { code: 'HSP109', name: 'Tour Guide Operations', division: 'academy', grouping: 'pathway', groupingCode: 'ACP-HHC', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Hybrid', language: 'English', shortDescription: 'ILO-validated curriculum for professional tour guiding in Kenya.', fullDescription: 'Tour Guide Operations covers tour planning, interpretation, visitor safety, cultural storytelling and sustainable tourism — aligned with ILO Kenya tourism standards.', feesUSD: 20, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Tour Guide Certificate', entryRequirements: ['Basic English proficiency','Interest in tourism and culture'], createdAt: '2026-09-01' },
  { code: 'GIT101', name: 'Git & GitHub', division: 'labs', grouping: 'track', groupingCode: 'LT-SWE', level: 'Beginner', levelBand: 'Foundation', duration: '3 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Version control essentials every developer must know.', fullDescription: 'Git & GitHub covers repositories, commits, branching, merging, pull requests and collaborative workflows used across every software team.', feesUSD: 10, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Git Certificate', entryRequirements: ['Basic computer literacy'], createdAt: '2026-09-01' },
  { code: 'FSW101', name: 'Full-Stack Web Development', division: 'labs', grouping: 'track', groupingCode: 'LT-SWE', level: 'Intermediate', levelBand: 'Practitioner', duration: '12 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build complete web applications from frontend to backend.', fullDescription: 'Full-Stack Web Development combines React frontend, Node.js/Express backend, database integration, authentication, deployment and project delivery.', feesUSD: 45, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Full-Stack Certificate', entryRequirements: ['JavaScript proficiency','Basic React knowledge'], createdAt: '2026-09-01' },
  { code: 'AID101', name: 'AI Integration for Developers', division: 'labs', grouping: 'track', groupingCode: 'LT-SWE', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Integrate AI APIs and models into real applications (+178% demand).', fullDescription: 'AI Integration for Developers covers OpenAI/Anthropic APIs, prompt orchestration, function calling, RAG basics, streaming responses and production AI features.', feesUSD: 30, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak AI Integration Certificate', entryRequirements: ['Programming proficiency','Basic API knowledge'], createdAt: '2026-09-01' },
  { code: 'DTL101', name: 'Data Literacy', division: 'labs', grouping: 'track', groupingCode: 'LT-DAT', level: 'Beginner', levelBand: 'Foundation', duration: '3 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Understand data and use it confidently in any role.', fullDescription: 'Data Literacy introduces data types, sources, basic analysis, data storytelling and ethical data use — no prior experience needed.', feesUSD: 0, isFree: true, certificatePriceUSD: 5, marketability: 'high', featured: true, certification: 'InnoSpeak Data Literacy Certificate', entryRequirements: ['Basic computer literacy'], createdAt: '2026-09-01' },
  { code: 'EXL101', name: 'Excel for Data Analysis', division: 'labs', grouping: 'track', groupingCode: 'LT-DAT', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Master Excel for real business analysis.', fullDescription: 'Excel for Data Analysis covers formulas, pivot tables, lookups, charts, dashboards and data cleaning used in every data role.', feesUSD: 15, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Excel Certificate', entryRequirements: ['Basic computer literacy'], createdAt: '2026-09-01' },
  { code: 'PBI101', name: 'Power BI', division: 'labs', grouping: 'track', groupingCode: 'LT-DAT', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build professional business intelligence dashboards (cert salary $91K).', fullDescription: 'Power BI covers data modelling, DAX, visualisation, dashboards and publishing, aligned with Microsoft PL-300 certification objectives.', feesUSD: 25, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Power BI Certificate', entryRequirements: ['Basic Excel knowledge'], createdAt: '2026-09-01' },
  { code: 'DEN102', name: 'Data Engineering', division: 'labs', grouping: 'track', groupingCode: 'LT-DAT', level: 'Advanced', levelBand: 'Advanced', duration: '12 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build data pipelines and infrastructure (cert salary $124K+).', fullDescription: 'Data Engineering covers ETL pipelines, data warehouses, cloud data platforms, orchestration and scalable data architecture.', feesUSD: 40, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Data Engineering Certificate', entryRequirements: ['SQL proficiency','Basic Python knowledge'], createdAt: '2026-09-01' },
  { code: 'PDS101', name: 'Python for Data Science', division: 'labs', grouping: 'track', groupingCode: 'LT-DAT', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Use Python to analyse and visualise real datasets.', fullDescription: 'Python for Data Science covers Pandas, NumPy, Matplotlib, data cleaning and exploratory analysis for data science workflows.', feesUSD: 22, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Python for Data Certificate', entryRequirements: ['Basic Python knowledge'], createdAt: '2026-09-01' },
  { code: 'AIA101', name: 'AI Agents Development', division: 'labs', grouping: 'track', groupingCode: 'LT-AIS', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build autonomous AI agents — Kenya search demand up 16,720%.', fullDescription: 'AI Agents Development covers agent architecture, tool use, memory, planning, multi-agent systems and deployment using LangChain, CrewAI and OpenAI APIs.', feesUSD: 35, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak AI Agents Certificate', entryRequirements: ['Python proficiency','Basic API knowledge'], createdAt: '2026-09-01' },
  { code: 'GEN101', name: 'Generative AI Applications', division: 'labs', grouping: 'track', groupingCode: 'LT-AIS', level: 'Intermediate', levelBand: 'Practitioner', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Build applications on top of generative AI models.', fullDescription: 'Generative AI Applications covers model selection, prompt engineering at scale, fine-tuning basics, evaluation and production deployment.', feesUSD: 28, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Generative AI Certificate', entryRequirements: ['Basic programming knowledge'], createdAt: '2026-09-01' },
  { code: 'AWS101', name: 'AWS Cloud Practitioner Preparation', division: 'labs', grouping: 'track', groupingCode: 'LT-CLD', level: 'Beginner', levelBand: 'Foundation', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Prepare for the AWS Certified Cloud Practitioner exam.', fullDescription: 'AWS Cloud Practitioner Preparation covers cloud concepts, AWS core services, security, architecture, pricing and support aligned with the official CLF-C02 exam.', feesUSD: 25, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Readiness Certificate — AWS CCP Prep', entryRequirements: ['Basic IT knowledge'], createdAt: '2026-09-01' },
  { code: 'AWS102', name: 'AWS Solutions Architect Preparation', division: 'labs', grouping: 'track', groupingCode: 'LT-CLD', level: 'Advanced', levelBand: 'Advanced', duration: '10 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Prepare for the AWS Solutions Architect Associate exam.', fullDescription: 'AWS Solutions Architect Preparation covers resilient architectures, high-performing systems, security and cost-optimised design aligned with the SAA-C03 exam.', feesUSD: 45, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Readiness Certificate — AWS SAA Prep', entryRequirements: ['AWS CCP knowledge or equivalent'], createdAt: '2026-09-01' },
  { code: 'AZR101', name: 'Azure Fundamentals (AZ-900) Preparation', division: 'labs', grouping: 'track', groupingCode: 'LT-CLD', level: 'Beginner', levelBand: 'Foundation', duration: '5 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Prepare for the Microsoft Azure Fundamentals certification.', fullDescription: 'Azure Fundamentals covers cloud concepts, Azure services, security, governance and pricing aligned with the official AZ-900 exam.', feesUSD: 22, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Readiness Certificate — AZ-900 Prep', entryRequirements: ['Basic IT knowledge'], createdAt: '2026-09-01' },
  { code: 'DVO101', name: 'DevOps Fundamentals', division: 'labs', grouping: 'track', groupingCode: 'LT-CLD', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Learn the DevOps culture, practices and toolchain.', fullDescription: 'DevOps Fundamentals covers CI/CD, infrastructure as code, monitoring, collaboration and release engineering.', feesUSD: 28, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak DevOps Certificate', entryRequirements: ['Basic Linux and networking knowledge'], createdAt: '2026-09-01' },
  { code: 'DKR101', name: 'Docker & Kubernetes', division: 'labs', grouping: 'track', groupingCode: 'LT-CLD', level: 'Advanced', levelBand: 'Advanced', duration: '10 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Containerise and orchestrate applications at production scale.', fullDescription: 'Docker & Kubernetes covers containers, images, registries, pods, deployments, services, scaling and cluster operations.', feesUSD: 40, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Docker & Kubernetes Certificate', entryRequirements: ['DevOps or Linux experience'], createdAt: '2026-09-01' },
  { code: 'CYB301', name: 'Network Security', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Protect networks from modern threats (Kenya: 45K unfilled roles).', fullDescription: 'Network Security covers firewalls, IDS/IPS, VPNs, network monitoring and defence against common network attacks.', feesUSD: 30, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Network Security Certificate', entryRequirements: ['Basic networking knowledge'], createdAt: '2026-09-01' },
  { code: 'CYB302', name: 'Cloud Security', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Secure cloud infrastructure and workloads.', fullDescription: 'Cloud Security covers identity, access, encryption, compliance, cloud-native security tools and securing AWS/Azure/GCP environments.', feesUSD: 32, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak Cloud Security Certificate', entryRequirements: ['Basic cloud knowledge'], createdAt: '2026-09-01' },
  { code: 'CYB303', name: 'Application Security', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Secure applications from design to deployment.', fullDescription: 'Application Security covers secure coding, OWASP Top 10, threat modelling, code review and security testing.', feesUSD: 30, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak AppSec Certificate', entryRequirements: ['Basic programming knowledge'], createdAt: '2026-09-01' },
  { code: 'CYB304', name: 'SOC Analysis', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Intermediate', levelBand: 'Practitioner', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Monitor, detect and respond from a Security Operations Centre.', fullDescription: 'SOC Analysis covers SIEM tools, log analysis, alert triage, threat hunting and incident escalation for SOC analyst roles.', feesUSD: 32, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: true, certification: 'InnoSpeak SOC Analyst Certificate', entryRequirements: ['Basic networking and security knowledge'], createdAt: '2026-09-01' },
  { code: 'CYB305', name: 'Incident Response', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Advanced', levelBand: 'Advanced', duration: '6 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Manage and contain security incidents end-to-end.', fullDescription: 'Incident Response covers preparation, detection, containment, eradication, recovery and post-incident review aligned with NIST frameworks.', feesUSD: 30, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Incident Response Certificate', entryRequirements: ['Security fundamentals experience'], createdAt: '2026-09-01' },
  { code: 'CYB306', name: 'DevSecOps', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Advanced', levelBand: 'Advanced', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Integrate security into DevOps pipelines.', fullDescription: 'DevSecOps covers secure CI/CD, automated security testing, secrets management and compliance-as-code.', feesUSD: 35, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak DevSecOps Certificate', entryRequirements: ['DevOps and security experience'], createdAt: '2026-09-01' },
  { code: 'CYB307', name: 'Digital Forensics', division: 'labs', grouping: 'track', groupingCode: 'LT-CYB', level: 'Advanced', levelBand: 'Advanced', duration: '8 Weeks', studyMode: 'Online', language: 'English', shortDescription: 'Investigate digital crimes and preserve evidence.', fullDescription: 'Digital Forensics covers evidence acquisition, disk and memory forensics, mobile forensics and legal reporting.', feesUSD: 35, isFree: false, certificatePriceUSD: 0, marketability: 'high', featured: false, certification: 'InnoSpeak Digital Forensics Certificate', entryRequirements: ['Security fundamentals experience'], createdAt: '2026-09-01' },
];

export const COURSE_UPDATES = {
  TOF101: { name: 'TOEFL Preparation (2026 Format)', fullDescription: 'TOEFL Preparation is fully aligned with the updated ETS TOEFL iBT (January 2026) — adaptive testing, new tasks, 1–6 score scale, four section scores and temporary comparable 0–120 score.', certification: 'InnoSpeak Readiness Certificate — TOEFL Preparation', groupingCode: 'ACP-IQU', updatedAt: '2026-09-01' },
  GMA101: { name: 'GMAT Preparation (2026 Format)', fullDescription: 'GMAT Preparation covers the current 3-section format — Quantitative Reasoning (21 Q), Verbal Reasoning (23 Q) and Data Insights (20 Q). No essay. 2h 15m. Score 205–805.', certification: 'InnoSpeak Readiness Certificate — GMAT Preparation', groupingCode: 'ACP-IQU', updatedAt: '2026-09-01' },
  IGC201: { name: 'Cambridge IGCSE Subject Preparation', groupingCode: 'ACP-IQU', updatedAt: '2026-09-01' },
  IGC301: { name: 'Cambridge AS Level Preparation', fullDescription: 'Cambridge AS Level Preparation covers AS Level subject content, analytical skills and exam technique. (Note: AS Level is a distinct Cambridge International qualification, not part of IGCSE.)', groupingCode: 'ACP-IQU', updatedAt: '2026-09-01' },
  IGC401: { name: 'Cambridge A Level Preparation', fullDescription: 'Cambridge A Level Preparation covers A Level subject content, critical analysis and exam technique for university admission. (Note: A Level is a distinct Cambridge International qualification, not part of IGCSE.)', groupingCode: 'ACP-IQU', updatedAt: '2026-09-01' },
  ELE201: { name: 'Electrical Engineering Foundations', fullDescription: 'Electrical Engineering Foundations introduces circuit analysis, electrical machines, power systems and safety. This is a foundation course — not a substitute for a full engineering degree.', certification: 'InnoSpeak Electrical Engineering Foundations Certificate', groupingCode: 'LT-ENG', updatedAt: '2026-09-01' },
  DEN101: { name: 'Data Entry & Digital Operations', shortDescription: 'Build accuracy, speed and digital operations skills for remote back-office work.', fullDescription: 'Data Entry & Digital Operations covers typing, spreadsheet organisation, data quality, digital tools and client communication. Connects to the Data & Analytics Track progression.', groupingCode: 'ACP-FRW', updatedAt: '2026-09-01' },
  COD101: { groupingCode: 'LT-SWE', division: 'labs', isFree: true, certificatePriceUSD: 5 },
  WEB101: { groupingCode: 'LT-SWE', division: 'labs', isFree: true, certificatePriceUSD: 7 },
  JSC101: { groupingCode: 'LT-SWE', division: 'labs' },
  REA101: { groupingCode: 'LT-SWE', division: 'labs' },
  MOB101: { groupingCode: 'LT-SWE', division: 'labs' },
  JAV101: { groupingCode: 'LT-SWE', division: 'labs' },
  PY101: { groupingCode: 'LT-SWE', division: 'labs' },
  FIG101: { groupingCode: 'LT-SWE', division: 'labs' },
  UIX101: { groupingCode: 'LT-SWE', division: 'labs' },
  UID101: { groupingCode: 'LT-SWE', division: 'labs' },
  UXD101: { groupingCode: 'LT-SWE', division: 'labs' },
  CRD104: { groupingCode: 'LT-SWE', division: 'labs' },
  AIF101: { groupingCode: 'LT-AIS', division: 'labs', isFree: true, certificatePriceUSD: 7 },
  AI101: { groupingCode: 'LT-AIS', division: 'labs' },
  AIP101: { groupingCode: 'LT-AIS', division: 'labs' },
  ML101: { groupingCode: 'LT-AIS', division: 'labs' },
  DSC101: { groupingCode: 'LT-DAT', division: 'labs' },
  SQL101: { groupingCode: 'LT-DAT', division: 'labs' },
  BAN101: { groupingCode: 'LT-DAT', division: 'labs' },
  CLD101: { groupingCode: 'LT-CLD', division: 'labs' },
  NET101: { groupingCode: 'LT-CLD', division: 'labs' },
  LNX101: { groupingCode: 'LT-CLD', division: 'labs' },
  CYB101: { groupingCode: 'LT-CYB', division: 'labs', isFree: true, certificatePriceUSD: 5 },
  CYB201: { groupingCode: 'LT-CYB', division: 'labs' },
  EDR101: { groupingCode: 'LT-ENG', division: 'labs' },
  SOL101: { groupingCode: 'LT-ENG', division: 'labs' },
  REN101: { groupingCode: 'LT-ENG', division: 'labs' },
  PLC101: { groupingCode: 'LT-ENG', division: 'labs' },
  CAD101: { groupingCode: 'LT-ENG', division: 'labs' },
  CIV101: { groupingCode: 'LT-ENG', division: 'labs' },
  MEC101: { groupingCode: 'LT-ENG', division: 'labs' },
  MTR101: { groupingCode: 'LT-ENG', division: 'labs' },
  ROB101: { groupingCode: 'LT-ENG', division: 'labs' },
  IAT101: { groupingCode: 'LT-ENG', division: 'labs' },
  IOT101: { groupingCode: 'LT-ENG', division: 'labs' },
  TDP101: { groupingCode: 'LT-ENG', division: 'labs' },
  ELI101: { groupingCode: 'LT-ENG', division: 'labs' },
  ELN101: { groupingCode: 'LT-ENG', division: 'labs' },
  EMA101: { groupingCode: 'LT-ENG', division: 'labs' },
  ELC101: { groupingCode: 'LT-ENG', division: 'labs' },
  MOG101: { groupingCode: 'LT-CRT', division: 'labs' },
  MOT101: { groupingCode: 'LT-CRT', division: 'labs' },
  POD101: { groupingCode: 'LT-CRT', division: 'labs' },
  VDE101: { groupingCode: 'LT-CRT', division: 'labs' },
};

export const COURSE_REMOVALS = ['KCS101'];

export const COMING_SOON_REPLACEMENTS = {
  CBP101: 'PRI-G03 → PRI-G06',
  CBJ101: 'JSS-G07 → JSS-G09',
  CBS101: 'SSS-G10 → SSS-G12',
};

export const FREE_COURSE_CODES = [
  'ICT101','DLP101','DLP105','AI-LIT-01','CVW101','ITP101','LKD101','ENG101','ENG111','EDT108',
  'COD101','WEB101','DTL101','AIF101','CYB101',
];

/**
 * Apply the V3 migration to the existing COURSES array.
 * Returns a new array with updates, removals, and new courses applied.
 */
export function applyV3Migration(existingCourses) {
  const removalSet = new Set(COURSE_REMOVALS);
  const existingCodes = new Set(existingCourses.map((c) => c.code));
  const newCourseCodes = new Set(NEW_COURSES.map((c) => c.code));

  const updated = existingCourses
    .filter((c) => !removalSet.has(c.code))
    .map((c) => {
      const update = COURSE_UPDATES[c.code];
      if (!update) return c;

      const merged = { ...c, ...update };

      if (update.division && update.division !== c.pillar) {
        merged.pillar = update.division;
        merged.academy = update.division === 'labs' ? LABS : ACADEMY;
      }

      if (update.isFree !== undefined) {
        merged.isFree = update.isFree;
        if (update.isFree) merged.fees = 'Free';
      }

      if (update.certificatePriceUSD !== undefined) {
        merged.certificatePriceUSD = update.certificatePriceUSD;
      }

      return merged;
    });

  for (const [code, replacement] of Object.entries(COMING_SOON_REPLACEMENTS)) {
    const course = updated.find((c) => c.code === code);
    if (course) {
      course.status = 'coming_soon';
      course.replacementNote = replacement;
    }
  }

  const newToAdd = NEW_COURSES
    .filter((c) => !existingCodes.has(c.code))
    .map(normalizeNewCourse);

  return [...updated, ...newToAdd];
}
