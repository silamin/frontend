import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NavBarService} from "../../services/nav-bar.service";
import {UserStore} from "../../stores/UserStore";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit{
  @Input() isCompanyUser
  navItems: any[] = [];
  jobPopupVisible = false;
  isDisplay = false;
  @Input() showSearchBar = false;
  isNavOpen = false;
  activeNavItemIndex: number = 0;

  constructor(private router: Router, private navBarService: NavBarService, private userStore: UserStore) { }


  async handleIconClicked(title: string){
    this.activeNavItemIndex = this.navItems.findIndex(item => item.title === title);

    switch (title){
      case 'Profile': await this.router.navigate(['/user-profile']);break;
      case 'Liked jobs': await this.router.navigate(['/liked-jobs']);break;
      case 'Status': await this.router.navigate(['/status']);break;
      case 'Home': this.isCompanyUser ? await this.router.navigate(['/company-main-page']) :
      await this.router.navigate(['/user-main-page']);break;
      case 'Post a job': this.jobPopupVisible = true;
    }
    this.navBarService.setActiveNavItemIndex(this.activeNavItemIndex);
  }
  handleNavToggle() {
    this.isNavOpen = !this.isNavOpen;
  }

  hideJobPopUp() {

  }
  ngOnInit(): void {
    this.navBarService.activeNavItemIndex$.subscribe(index => {
      this.activeNavItemIndex = index;
    });
    if (!this.isCompanyUser){
      this.navItems = [
        { title: 'Home', href: '', icon: 'fa-home', active: true },
        { title: 'Profile', href: '', icon: 'fa-user' },
        { title: 'Liked jobs', href: '', icon: 'fa-heart' },
        { title: 'Status', href: '', icon: 'fa-envelope' },
        { title: 'Log out', href: '', icon: 'fa-sign-out-alt' },
      ];
    }else {
      this.navItems = [
        { title: 'Home', href: '', icon: 'fa-home', active: true },
        { title: 'Post a job', href: '', icon: 'fa-plus' },
        { title: 'Status', href: '', icon: 'fa-envelope' },
        { title: 'Log out', href: '', icon: 'fa-sign-out-alt' },
      ];
    }
  }
}
