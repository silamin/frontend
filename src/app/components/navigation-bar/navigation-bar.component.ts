import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Input() navItems: any[] = [];
  jobPopupVisible = false;
  isDisplay = false;
  @Input() showSearchBar = false;
  isNavOpen = false;
  activeNavItemIndex: number = 0;

  constructor(private router: Router) {}

  handleIconClicked(title: string){
    console.log(this.navItems.findIndex(item => item.title === title))
    this.activeNavItemIndex = this.navItems.findIndex(item => item.title === title);

    switch (title){
      case 'Profile': this.router.navigate(['/user-profile']);break;
      case 'Liked jobs': this.router.navigate(['/liked-jobs']);break;
      case 'Messages': this.router.navigate(['/messages']);break;
      case 'Home': this.router.navigate(['/user-main-page'])
    }
  }
  handleNavToggle() {
    this.isNavOpen = !this.isNavOpen;
  }

  hideJobPopUp() {

  }
}
