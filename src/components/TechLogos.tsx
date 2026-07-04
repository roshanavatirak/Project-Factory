import React from "react";

// Simplified high-fidelity SVG paths for our technology stack marquee.
// All icons accept aclassName prop for size, fill, and transition styling.

export const ReactLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="0" cy="0" r="2.05" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const NextjsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 180 180" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M180 90C180 139.706 139.706 180 90 180C40.2944 180 0 139.706 0 90C0 40.2944 40.2944 0 90 0C139.706 0 180 40.2944 180 90ZM115.348 53H98.9242V127H115.348V53ZM64.6517 53H48.2278V127H64.6517V53ZM83.576 53H79.8058V127H96.2297L83.576 53Z" />
  </svg>
);

export const NodejsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 288" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M128 0L24.8 60v120L128 240l103.2-60V60L128 0zm79.1 166.3l-79.1 46.1-79.1-46.1V73.7l79.1-46.1 79.1 46.1v92.6z" />
  </svg>
);

export const DockerLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V9.006a.185.185 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.575a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.083.186.185.186m0 2.774h2.118c.101 0 .185-.083.185-.185V6.349a.185.185 0 00-.185-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954 2.656h2.119a.186.186 0 00.185-.186V9.006a.185.185 0 00-.185-.186H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.773h2.119a.185.185 0 00.185-.186V6.349a.185.185 0 00-.185-.185H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954 2.773h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.773h2.119a.185.185 0 00.185-.186V6.349a.185.185 0 00-.185-.185H5.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M2.166 11.078h2.119c.102 0 .185-.083.185-.185V9.006a.185.185 0 00-.185-.186H2.166a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m10.932 5.43h2.119c.102 0 .186-.083.186-.185v-1.887a.185.185 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.888c0 .101.083.185.185.185m-16.035-2.07c.073.49.255.973.543 1.382.72.997 2.008 1.48 2.885 1.48 4.275 0 7.37-3.415 8.784-5.32 1.315-.027 2.628-.018 3.93-.01.554.004 1.107.008 1.656-.008.832-.025 1.62-.162 2.37-.4 1.398-.443 2.55-1.463 3.473-2.997.356-.593.633-1.27.82-1.996a.186.186 0 00-.236-.22c-1.397.433-2.696.527-3.93.284-.11-.022-.218-.046-.328-.073a5.556 5.556 0 01-3.79 1.424c-1.378.007-2.737-.01-4.088-.027-1.127-.014-2.247-.027-3.353-.013-1.42 1.93-4.526 5.34-8.815 5.34-.347 0-.67-.04-1-.137h-.008z" />
  </svg>
);

export const KubernetesLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 .09L2.24 3.52v7.71L12 23.91l9.76-12.68V3.52L12 .09zm7.3 10.45l-7.3 9.49-7.3-9.49V5.13l7.3-2.58 7.3 2.58v5.41z" />
  </svg>
);

export const PostgresqlLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2a10 10 0 00-6 18h12a10 10 0 00-6-18zm0 2c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM8.5 7.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
  </svg>
);

export const SolidityLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 1.5L5.25 12 12 22.5 18.75 12 12 1.5zm0 3.86l4.28 6.64L12 18.64l-4.28-6.64L12 5.36z" />
  </svg>
);

export const TensorflowLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2.5L3.5 7.4v9.8L12 22.1l8.5-4.9V7.4L12 2.5zM12 5l6.5 3.8v7.5L12 20.1l-6.5-3.8V8.8L12 5z" />
  </svg>
);

export const PytorchLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7.5h2V12.5z" />
  </svg>
);

export const PythonLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm2 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
  </svg>
);

export const TypescriptLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.5 2.5v19h19v-19h-19zm13.1 11.2h2.2v4.2c-.6.3-1.4.5-2.2.5-1.9 0-3-.9-3-2.9v-1.8h3v1.8c0 .6.3.9.9.9.4 0 .7-.1.9-.3.2-.2.3-.5.3-.8v-1.6zm-5.5 0h2.2v4.7H10.1v-4.7z" />
  </svg>
);

export const FastapiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 3.3L18.7 8l-6.7 3.3L5.3 8 12 5.3zm-6.7 5.5l5.7 2.8v5.1l-5.7-2.8v-5.1zm7.7 7.9v-5.1l5.7-2.8v5.1l-5.7 2.8z" />
  </svg>
);

export const GoLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H9v-2h4v2zm2-4H7V8h8v4z" />
  </svg>
);

export const MongodbLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 1.5C8 6 6 10 6 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2-7-6-11.5z" />
  </svg>
);

export const AwsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L2 22h20L12 2zm0 5l6.5 13H5.5L12 7z" />
  </svg>
);

export const GeminiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L9 9 2 12l7 3 3 7 3-7 7-3-7-3-3-7z" />
  </svg>
);

// Unified Marquee Renderer that lists SVGs, Names and Brand colors
export const TechLogoList = [
  { name: "Solidity", logo: SolidityLogo, color: "#A1A1A5" },
  { name: "Node.js", logo: NodejsLogo, color: "#339933" },
  { name: "TensorFlow", logo: TensorflowLogo, color: "#FF6F00" },
  { name: "PyTorch", logo: PytorchLogo, color: "#EE4C2C" },
  { name: "Docker", logo: DockerLogo, color: "#2496ED" },
  { name: "Kubernetes", logo: KubernetesLogo, color: "#326CE5" },
  { name: "PostgreSQL", logo: PostgresqlLogo, color: "#336791" },
  { name: "React", logo: ReactLogo, color: "#61DAFB" },
  { name: "Next.js", logo: NextjsLogo, color: "#FFFFFF" },
  { name: "Python", logo: PythonLogo, color: "#3776AB" },
  { name: "TypeScript", logo: TypescriptLogo, color: "#3178C6" },
  { name: "FastAPI", logo: FastapiLogo, color: "#009688" },
  { name: "Go", logo: GoLogo, color: "#00ADD8" },
  { name: "MongoDB", logo: MongodbLogo, color: "#47A248" },
  { name: "AWS", logo: AwsLogo, color: "#FF9900" },
  { name: "Gemini", logo: GeminiLogo, color: "#9B72CB" }
];
