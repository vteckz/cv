// Linton Evans - CV Data Structure
export const cvData = {
  personal: {
    name: "Linton Evans",
    title: "Technical Specialist",
    email: "linton.evans@outlook.com",
    phone: "+64-21-939-505",
    location: "Auckland, New Zealand",
    linkedin: "linkedin.com/in/lintonevans",
    noticePeriod: "1-2 Weeks Negotiable"
  },

  summary: `I am a Technical Specialist with extensive experience in E-Commerce, Inventory Management,
Unified Communications, Contact Centre, Systems Development, and Business Operations across
Enterprise, SME, and SMB environments. Combining over 17 years of enterprise experience with recent
hands-on leadership in systems development, e-commerce and business operations, I've designed
and delivered Technical Solutions for a variety of clients from small to large scale.`,

  shortSummary: `Technical Specialist with 17+ years bridging deep technical expertise with practical business execution.
Former Product Architect at Spark NZ, now running successful e-commerce and technology ventures.`,

  leadership: `I am a hands-on technical leader who builds trust through competence, clarity, and collaboration.
Known for bridging technical depth with business outcomes, I lead by empowering others, creating
environments where teams take ownership and deliver with precision.`,

  experience: [
    {
      id: 'etraders',
      title: "Owner / Operator",
      company: "E & E Traders Limited",
      period: "2019 - Present",
      location: "Auckland, NZ",
      highlights: [
        "Owned and operated a hobby & technology-focused e-commerce business and cryptocurrency mining venture with full P&L accountability",
        "Led setup, configuration, and customisation of e-commerce platforms, primarily BigCommerce with theme modifications, HTML/CSS editing, and integrations",
        "Delivered omnichannel API integrations including feeds, webhooks, Amazon API linkages, and vendor synchronization",
        "Developed AI-driven product enrichment and pricing tools using OpenAPI and SERP integrations via REST and GraphQL APIs",
        "Designed multi-channel digital campaigns across Google Ads, Meta, Pinterest, Reddit achieving measurable improvements in CTR, CPC, and ROAS",
        "Implemented advanced tag management frameworks using GA4 and Google Tag Manager for cross-channel performance analysis",
        "Built automation scripts and API connectors to streamline inventory management, logistics, and reporting",
        "Technical repair services including ASIC diagnosis, SMD replacement, micro-soldering, ARM firmware diagnostics"
      ],
      skills: ["BigCommerce", "Shopify", "REST APIs", "GraphQL", "Google Ads", "GA4", "GTM", "Python", "JavaScript"]
    },
    {
      id: 'spark',
      title: "Product Architect - Unified Communications",
      company: "Spark New Zealand",
      period: "2014 - 2020",
      location: "Auckland, NZ",
      highlights: [
        "Led consulting, design, and delivery of Microsoft UC and Contact Centre solutions across enterprise and government clients",
        "Designed and implemented Spark's centralised SIP delivery platform and hosted Microsoft Teams Calling service",
        "Co-developed the Telecommunications-as-a-Service (TaaS) offering for All-of-Government clients",
        "Managed all key stakeholders, vendors, and SL Teams",
        "Delivered Skype for Business and Microsoft Teams voice integrations for commercial, healthcare, and government sectors",
        "Migration and integration from PABX solutions including Avaya, CUCM, NEC, Asterisk",
        "A/V Room Integration with Surface Hub, Polycom, Crestron, RCC, Yealink"
      ],
      skills: ["Microsoft Teams", "Skype for Business", "SIP", "Contact Centre", "Azure", "Enterprise Architecture"]
    },
    {
      id: 'pureip',
      title: "Unified Communications Manager",
      company: "Pure IP Limited",
      period: "2014",
      location: "Auckland, NZ",
      highlights: [
        "Headed the Microsoft Lync division, responsible for consulting, design, configuration, deployment, and support",
        "Built and expanded the company's Microsoft Lync business portfolio and customer base",
        "Integrated VOIP and PSTN systems including Sonus UX 1000/2000 and Cisco ISR gateways",
        "Oversaw infrastructure management and internal system development"
      ],
      skills: ["Microsoft Lync", "VoIP", "SIP Trunking", "Sonus SBC", "Cisco"]
    },
    {
      id: 'zeacom',
      title: "APAC IT Network Manager",
      company: "Zeacom Ltd / Enghouse Interactive",
      period: "2011 - 2014",
      location: "Auckland, NZ",
      highlights: [
        "Managed IT infrastructure across Australia and New Zealand, leading technical teams",
        "Directed asset lifecycle management, cost control, and system upgrades",
        "Supported integration of Microsoft UC stack for product development post-acquisition",
        "Implementation of core network technologies including MPLS, IPSEC, BGP and OSPF",
        "ISR and ASA configuration, switching setup, and firewall configuration"
      ],
      skills: ["Network Infrastructure", "MPLS", "IPSEC", "BGP", "OSPF", "Cisco ASA", "Team Leadership"]
    }
  ],

  certifications: [
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", icon: "aws" },
    { name: "PureCloud Core Professional", issuer: "Genesys", icon: "genesys" },
    { name: "Polycom Microsoft Room Systems ICCE Engineer", issuer: "Polycom", icon: "polycom" },
    { name: "Cloud PBX Certified Genesis Dialer Engineer", issuer: "Genesys", icon: "genesys" },
    { name: "SOF Certified Sonus SBC 5K/7K/SWE Engineer", issuer: "Sonus", icon: "sonus" },
    { name: "Microsoft Certified Professional (MCPS)", issuer: "Microsoft", icon: "microsoft" },
    { name: "Microsoft Certified IT Professional - Lync Server", issuer: "Microsoft", icon: "microsoft" }
  ],

  education: [
    {
      degree: "Bachelor of Computing Sciences",
      institution: "Unitec Institute of Technology",
      period: "2004 - 2008",
      location: "Auckland, NZ"
    },
    {
      degree: "Certificate in Information Systems",
      institution: "Unitec Institute of Technology",
      period: "2002 - 2004",
      location: "Auckland, NZ"
    }
  ],

  skills: {
    technical: [
      "JavaScript", "Python", "HTML/CSS", "REST APIs", "GraphQL",
      "Three.js", "Node.js", "BigCommerce", "Shopify"
    ],
    platforms: [
      "Microsoft Teams", "Azure", "AWS", "Google Cloud",
      "Skype for Business", "Microsoft Lync"
    ],
    infrastructure: [
      "SIP/VoIP", "Contact Centre", "Network Architecture",
      "MPLS", "BGP", "OSPF", "Cisco", "Firewall"
    ],
    marketing: [
      "Google Ads", "GA4", "GTM", "SEO",
      "Meta Ads", "Email Automation", "A/B Testing"
    ],
    business: [
      "E-Commerce", "P&L Management", "Vendor Management",
      "Technical Leadership", "Solution Architecture"
    ]
  },

  // Speech scripts for avatar narration
  speeches: {
    welcome: `G'day! I'm Linton Evans, a Technical Specialist based in Auckland, New Zealand.
Welcome to my interactive portfolio. Let me walk you through my experience and skills.`,

    about: `With over 17 years of enterprise experience, I bridge deep technical expertise with practical business execution.
I've designed and delivered technical solutions for clients ranging from small businesses to large government organisations.`,

    experience: `I've held senior technical roles at major companies. Most recently, I've been running my own e-commerce
and technology business. Before that, I was the Product Architect for Microsoft Collaboration at Spark New Zealand,
delivering large-scale unified communications solutions.`,

    skills: `My technical expertise spans e-commerce platforms, API development, cloud services, unified communications,
and digital marketing. I'm equally comfortable writing code, architecting solutions, or leading technical teams.`,

    education: `I hold a Bachelor of Computing Sciences from Unitec Institute of Technology, along with multiple
industry certifications including AWS Cloud Practitioner and Microsoft Certified Professional.`,

    contact: `I'm currently available with a notice period of 1 to 2 weeks. Feel free to reach out via email at
linton.evans@outlook.com or connect with me on LinkedIn. I'd love to discuss how I can contribute to your team.`
  }
};

export default cvData;
