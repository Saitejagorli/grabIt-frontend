import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { MenuItem } from 'primeng/api';

import { LucideDynamicIcon } from '@lucide/angular';

import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-shell',
  imports: [
    DrawerModule,
    PanelMenuModule,
    BreadcrumbModule,
    LucideDynamicIcon,
    RouterOutlet,
    NgClass,
  ],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent implements OnInit {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 1023px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  isDrawerOpen = signal(true);

  items!: MenuItem[];
  breadcrumbItems!: MenuItem[];

  panelMenuTokens = {
    panel: {
      border: { width: '0px' },
      first: { border: { width: '0px' } },
      last: { border: { width: '0px' } },
    },
    item: {
      focus: { background: 'transparent' },
    },
  };

  breadCrumbTokens = {
    background: 'transparent',
  };

  constructor() {
    effect(
      () => {
        this.isDrawerOpen.set(!this.isMobile());
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'house', url: '/admin/dashboard' },
      { label: 'Orders', icon: 'bring-to-front', url: '/admin/orders' },
      {
        label: 'Products',
        icon: 'box',
        items: [
          { label: 'All Products', icon: 'boxes', url: '/admin/products' },
          {
            label: 'Add Product',
            icon: 'package-plus',
            url: '/admin/products/add',
          },
        ],
      },
      { label: 'Customers', icon: 'users', url: '/admin/customers' },
      { label: 'Inventory', icon: 'warehouse', url: '/admin/inventory' },
      { label: 'Reports', icon: 'chart-spline', url: '/admin/reports' },
      { label: 'Marketing', icon: 'megaphone', url: '/admin/marketing' },
      { label: 'Settings', icon: 'settings', url: '/admin/settings' },
    ];

    this.breadcrumbItems = [
      { label: 'Products', icon: 'boxes' },
      { label: 'Add Product', icon: 'package-plus' },
    ];
  }

  toggleDrawer() {
    this.isDrawerOpen.update((v) => !v);
  }

  closeOnMobile() {
    if (this.isMobile()) {
      this.isDrawerOpen.set(false);
    }
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
