import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {NavBarService} from "../../services/nav-bar.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit{
  @Input() navItems: any[] = [];
  jobPopupVisible = false;
  isDisplay = false;
  @Input() showSearchBar = false;
  isNavOpen = false;
  activeNavItemIndex: number = 0;

  constructor(private router: Router, private navBarService: NavBarService) { }


  handleIconClicked(title: string){
    console.log(this.navItems.findIndex(item => item.title === title))
    this.activeNavItemIndex = this.navItems.findIndex(item => item.title === title);

    switch (title){
      case 'Profile': this.router.navigate(['/user-profile']);break;
      case 'Liked jobs': this.router.navigate(['/liked-jobs']);break;
      case 'Messages': this.router.navigate(['/messages']);break;
      case 'Home': this.router.navigate(['/user-main-page']);break;
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
  }
}
