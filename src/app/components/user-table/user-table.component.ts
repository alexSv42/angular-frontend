import { Component, effect, input, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_USER_FILTERS, UserFilters, UserRow } from '../../models';
import {
  DataService,
  DropdownOptions,
  SortConfig,
  SortDirection,
} from '../../services/data.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DecimalPipe,
    FormsModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css',
})
export class UserTableComponent {
  users = input.required<UserRow[]>();
  dropdownOptions = input<DropdownOptions>({
    positions: [],
    levels: [],
    tech: [],
    employmentTypes: [],
  });

  filters: UserFilters = { ...DEFAULT_USER_FILTERS };
  sort: SortConfig = { column: '', direction: '' };

  private processedUsers = signal<UserRow[]>([]);

  currentPage = signal(1);
  totalResults = computed(() => this.processedUsers().length);
  totalPages = computed(() => Math.ceil(this.totalResults() / PAGE_SIZE) || 1);
  pagedUsers = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.processedUsers().slice(start, start + PAGE_SIZE);
  });

  displayedColumns: string[] = [
    'name',
    'email',
    'age',
    'position',
    'level',
    'experienceYears',
    'primaryTech',
    'secondaryTech',
    'salaryMonthly',
    'employmentType',
    'isRemote',
    'isActive',
  ];

  constructor(private dataService: DataService) {
    effect(() => {
      this.processedUsers.set(this.users());
    });
  }

  applyFilters(): void {
    const filtered = this.dataService.filterUsers(this.users(), this.filters);
    const sorted = this.dataService.sortUsers(filtered, this.sort);
    this.processedUsers.set(sorted);
    this.currentPage.set(1);
  }

  toggleSort(column: string): void {
    if (this.sort.column === column) {
      const next: SortDirection =
        this.sort.direction === 'asc'
          ? 'desc'
          : this.sort.direction === 'desc'
            ? ''
            : 'asc';
      this.sort = { column: next ? column : '', direction: next };
    } else {
      this.sort = { column, direction: 'asc' };
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sort.column !== column) return 'unfold_more';
    return this.sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
  }
}
