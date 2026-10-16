export interface DictionaryItem {
  id: string;
  name: string;
  code: string;
}

export interface Level extends DictionaryItem {
  rank: number;
}

export interface Position extends DictionaryItem {}

export interface EmploymentType extends DictionaryItem {}

export interface Tech {
  id: string;
  name: string;
  category: string;
}

export interface Dictionaries {
  levels: Level[];
  positions: Position[];
  tech: Tech[];
  employmentTypes: EmploymentType[];
}
