import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs';
import {
  MockData,
  User,
  UserRow,
  UserFilters,
} from '../models';

export interface DropdownOptions {
  positions: string[];
  levels: string[];
  tech: string[];
  employmentTypes: string[];
}

export type SortDirection = 'asc' | 'desc' | '';
export interface SortConfig {
  column: string;
  direction: SortDirection;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  private readonly mockData$ = this.http
    .get<MockData>('assets/mock_data.json')
    .pipe(shareReplay(1));

  readonly data$ = this.mockData$.pipe(
    map((data) => {
      const levelMap = this.buildLookup(data.levels);
      const positionMap = this.buildLookup(data.positions);
      const techMap = this.buildLookup(data.tech);
      const employmentTypeMap = this.buildLookup(data.employmentTypes);

      const users: UserRow[] = data.users.map((user) =>
        this.mapUser(user, positionMap, levelMap, techMap, employmentTypeMap)
      );

      const dropdownOptions: DropdownOptions = {
        positions: data.positions.map((p) => p.name),
        levels: data.levels.map((l) => l.name),
        tech: data.tech.map((t) => t.name),
        employmentTypes: data.employmentTypes.map((e) => e.name),
      };

      return { meta: data.meta, users, dropdownOptions };
    })
  );

  private buildLookup<T extends { id: string; name: string }>(
    items: T[]
  ): Map<string, string> {
    return new Map(items.map((item) => [item.id, item.name]));
  }

  private mapUser(
    user: User,
    positions: Map<string, string>,
    levels: Map<string, string>,
    tech: Map<string, string>,
    employmentTypes: Map<string, string>
  ): UserRow {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      address: user.address,
      phone: user.phone,
      position: positions.get(user.positionId) ?? 'Unknown',
      level: levels.get(user.levelId) ?? 'Unknown',
      experienceYears: user.experienceYears,
      primaryTech: tech.get(user.primaryTechId) ?? 'Unknown',
      secondaryTech: user.secondaryTechIds.map(
        (id) => tech.get(id) ?? 'Unknown'
      ),
      salaryMonthly: user.salaryMonthly,
      employmentType: employmentTypes.get(user.employmentTypeId) ?? 'Unknown',
      isRemote: user.isRemote,
      isActive: user.isActive,
    };
  }

  public filterUsers(users: UserRow[], filters: UserFilters): UserRow[] {
    return users.filter((user) => {
      if (filters.name) {
        const term = filters.name.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(term)) return false;
      }
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.position && user.position !== filters.position) return false;
      if (filters.level && user.level !== filters.level) return false;
      if (filters.primaryTech && user.primaryTech !== filters.primaryTech) return false;
      if (filters.employmentType && user.employmentType !== filters.employmentType) return false;
      if (filters.isRemote !== null && user.isRemote !== filters.isRemote) return false;
      if (filters.isActive !== null && user.isActive !== filters.isActive) return false;
      return true;
    });
  }

  public sortUsers(users: UserRow[], sort: SortConfig): UserRow[] {
    if (!sort.column || !sort.direction) return users;

    const sorted = [...users];
    const dir = sort.direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sort.column) {
        case 'name':
          valA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          valA = a.email.toLowerCase();
          valB = b.email.toLowerCase();
          break;
        case 'age':
          valA = a.age;
          valB = b.age;
          break;
        case 'salaryMonthly':
          valA = a.salaryMonthly;
          valB = b.salaryMonthly;
          break;
        default:
          return 0;
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return sorted;
  }
}
