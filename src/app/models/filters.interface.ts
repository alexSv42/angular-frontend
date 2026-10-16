export interface UserFilters {
  name: string;
  email: string;
  position: string | null;
  level: string | null;
  primaryTech: string | null;
  employmentType: string | null;
  isRemote: boolean | null;
  isActive: boolean | null;
}

export const DEFAULT_USER_FILTERS: UserFilters = {
  name: '',
  email: '',
  position: null,
  level: null,
  primaryTech: null,
  employmentType: null,
  isRemote: null,
  isActive: null,
};
