import {Component} from "@angular/core";

@Component({
  selector: 'app-company-main-page',
  templateUrl: './company-main-page.component.html',
  styleUrls: ['./company-main-page.component.scss'],
})
export class CompanyMainPageComponent {
  isVisible = false;

  showPopUp() {
    this.isVisible = true;
  }

  hidePopUp() {
    this.isVisible = false;
  }
}
