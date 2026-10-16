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

  private readonly valueResolvers: Record<string, (user: UserRow) => string | number | boolean> = {
    name: (u) => `${u.firstName} ${u.lastName}`,
    email: (u) => u.email,
    position: (u) => u.position,
    level: (u) => u.level,
    primaryTech: (u) => u.primaryTech,
    employmentType: (u) => u.employmentType,
    isRemote: (u) => u.isRemote,
    isActive: (u) => u.isActive,
    age: (u) => u.age,
    salaryMonthly: (u) => u.salaryMonthly,
  };

  public filterUsers(users: UserRow[], filters: UserFilters): UserRow[] {
    const activeFilters = Object.entries(filters).filter(
      ([, value]) => value !== null && value !== ''
    );

    if (!activeFilters.length) return users;

    return users.filter((user) =>
      activeFilters.every(([key, filterValue]) => {
        const resolver = this.valueResolvers[key];
        if (!resolver) return true;

        const userValue = resolver(user);

        if (typeof filterValue === 'string' && typeof userValue === 'string') {
          return userValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        return userValue === filterValue;
      })
    );
  }

  public sortUsers(users: UserRow[], sort: SortConfig): UserRow[] {
    if (!sort.column || !sort.direction) return users;

    const resolver = this.valueResolvers[sort.column];
    if (!resolver) return users;

    const dir = sort.direction === 'asc' ? 1 : -1;

    return [...users].sort((a, b) => {
      let valA = resolver(a);
      let valB = resolver(b);

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }
}
