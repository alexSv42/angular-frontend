import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRow } from './models';
import { DataService, DropdownOptions } from './services/data.service';
import { UserTableComponent } from './components/user-table/user-table.component';

@Component({
  imports: [RouterOutlet, UserTableComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly dataService = inject(DataService);

  protected users = signal<UserRow[]>([]);
  protected dropdownOptions = signal<DropdownOptions>({
    positions: [],
    levels: [],
    tech: [],
    employmentTypes: [],
  });

  ngOnInit(): void {
    this.dataService.data$.subscribe((data) => {
      this.users.set(data.users);
      this.dropdownOptions.set(data.dropdownOptions);
    });
  }
}
