export interface Project {
  id: string;
  title: string;
  category: 'Web Applications' | 'Mobile Apps';
  techStack: string[];
  description: string;
  image: string;
  githubUrl: string;
  externalUrl: string;
}

export interface Capability {
  title: string;
  description: string;
  icon: string;
}
