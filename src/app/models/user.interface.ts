export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  positionId: string;
  levelId: string;
  experienceYears: number;
  primaryTechId: string;
  secondaryTechIds: string[];
  salaryMonthly: number;
  employmentTypeId: string;
  isRemote: boolean;
  isActive: boolean;
}

export interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  position: string;
  level: string;
  experienceYears: number;
  primaryTech: string;
  secondaryTech: string[];
  salaryMonthly: number;
  employmentType: string;
  isRemote: boolean;
  isActive: boolean;
}
