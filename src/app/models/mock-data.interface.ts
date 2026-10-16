import { Dictionaries } from './dictionary.interface';
import { User } from './user.interface';

export interface Meta {
  generatedAt: string;
  count: number;
  currency: string;
  salaryPeriod: string;
  locale: string;
}

export interface MockData extends Dictionaries {
  meta: Meta;
  users: User[];
}
