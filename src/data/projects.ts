export interface Project {
  id: string;
  title: string;
  category: string;
  domain: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: string;
  image: string;
  features: string[];
  techStack: string[];
  price: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const projectsData: Project[] = [
  {
    id: "nexus-swarm",
    title: "Nexus Agentic Swarm Coordinator",
    category: "Agentic AI",
    domain: "agentic",
    description: "An autonomous multi-agent task execution and delegation system powered by LangGraph, CrewAI, and Model Context Protocol (MCP) servers. Handles auto-recovering agent pipelines.",
    difficulty: "Advanced",
    duration: "4 Weeks",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    features: [
      "Dynamic multi-agent task routing with LangGraph workflow states",
      "Modular MCP server connector API integration",
      "Real-time token usage, pricing overhead, and execution analytics",
      "Persistent state management and automatic retry parameters"
    ],
    techStack: ["Python", "LangChain", "CrewAI", "Next.js", "PostgreSQL", "Tailwind CSS"],
    price: "$599",
    demoUrl: "https://nexus-swarm.demo",
    githubUrl: "https://github.com/project-factory/nexus-swarm"
  },
  {
    id: "novapay-wallet",
    title: "NovaPay Non-Custodial Smart Wallet",
    category: "Blockchain & Cyber",
    domain: "blockchain",
    description: "A next-generation non-custodial crypto wallet and gasless transaction gateway using Account Abstraction (ERC-4337) and Biometric recovery hooks.",
    difficulty: "Expert",
    duration: "6 Weeks",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    features: [
      "ERC-4337 smart contract account deployment scripts",
      "Paymaster transaction fee gasless sponsorship integration",
      "Multi-chain token swaps using Li.Fi aggregators",
      "Biometric passkey secure storage hardware integration"
    ],
    techStack: ["Solidity", "TypeScript", "React Native", "Ethers.js", "Firebase", "PostgreSQL"],
    price: "$799",
    demoUrl: "https://novapay.demo",
    githubUrl: "https://github.com/project-factory/novapay"
  },
  {
    id: "omniscribe-medical",
    title: "OmniScribe Real-time Medical NLP",
    category: "Artificial Intelligence",
    domain: "ai-ml",
    description: "An automated clinical note summarization system converting spoken physician-patient audio transcripts into structured HIPAA-compliant SOAP notes.",
    difficulty: "Advanced",
    duration: "5 Weeks",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    features: [
      "Real-time audio streaming pipeline using Python WebSockets",
      "Whisper API finetuned transcription formatting",
      "Llama-3 medical terminology clinical extraction agent",
      "HIPAA-compliant envelope encryption layers"
    ],
    techStack: ["React", "Python", "FastAPI", "PyTorch", "Docker", "MongoDB"],
    price: "$699",
    demoUrl: "https://omniscribe.demo",
    githubUrl: "https://github.com/project-factory/omniscribe"
  },
  {
    id: "vortex-threat",
    title: "Vortex Kernel Threat Intelligence",
    category: "Cyber Security",
    domain: "security",
    description: "Low-level system packet filter and network anomaly classification platform combining Linux kernel eBPF hooks and Random Forest anomaly classifiers.",
    difficulty: "Expert",
    duration: "8 Weeks",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    features: [
      "High-performance eBPF raw network packet sniffers in C",
      "Random Forest anomaly classifying API in Go",
      "Dynamic system call blocking rules automated daemon",
      "Interactive Grafana-style dashboard visualization interface"
    ],
    techStack: ["Go", "C", "React", "eBPF", "TimescaleDB", "Docker"],
    price: "$999",
    demoUrl: "https://vortex.demo",
    githubUrl: "https://github.com/project-factory/vortex-threat"
  },
  {
    id: "sentinel-iot",
    title: "Sentinel Telemetry Smart Grid Node",
    category: "Internet of Things",
    domain: "iot",
    description: "Industrial MQTT telemetry controller interface designed to handle ESP32 sensor logging, local caching, and cloud telemetry ingestion.",
    difficulty: "Intermediate",
    duration: "4 Weeks",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    features: [
      "Hardware-accelerated MQTT over TLS ESP32 client script",
      "Offline cache queuing using local flash memory partition",
      "Timeseries database ingestion dashboard visualization",
      "Slack/SMS webhook alert rules for grid spikes"
    ],
    techStack: ["C++", "React", "Node.js", "InfluxDB", "MQTT", "AWS IoT Core"],
    price: "$499",
    demoUrl: "https://sentinel.demo",
    githubUrl: "https://github.com/project-factory/sentinel"
  },
  {
    id: "synapse-vision",
    title: "Synapse Industrial Anomaly Scan",
    category: "Machine Learning",
    domain: "ai-ml",
    description: "An automated real-time conveyor belt defect scanner powered by custom YOLOv8 defect detection and edge-computed video frames.",
    difficulty: "Advanced",
    duration: "5 Weeks",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
    features: [
      "Fast YOLOv8 defect scanning image processing pipelines",
      "Low-latency RTSP video segment capture hooks",
      "Web-based alert log grid with capture snapshots",
      "Configurable classification model confidence threshold panels"
    ],
    techStack: ["Python", "FastAPI", "React", "OpenCV", "TensorFlow", "PostgreSQL"],
    price: "$649",
    demoUrl: "https://synapse.demo",
    githubUrl: "https://github.com/project-factory/synapse"
  }
];
