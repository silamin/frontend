import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Input() navItems: any[] = [];
  jobPopupVisible = false;
  isDisplay = false;


  handleIconClicked(title: string) {
    switch (title){
      case 'Home': console.log('home');break;
      case 'Messages': console.log('Messages');break;
      case 'Log out': console.log('logout');break;
      case 'Post a job': this.jobPopupVisible = true;
    }
  }

  hideJobPopUp() {

  }
}
