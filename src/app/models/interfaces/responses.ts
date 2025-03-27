export interface BadResponse {
  status: string;
  reason: string;
}

export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: number;
}

export interface Authors {
  authors: string[];
}

export interface Title {
  title: string;
}
