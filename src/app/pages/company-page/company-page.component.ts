import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.scss']
})
export class CompanyPageComponent implements OnInit {
  activeTab = 0;

  ngOnInit() {
    this.activeTab = 0;
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
