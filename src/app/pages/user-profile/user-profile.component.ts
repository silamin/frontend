import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{

  showMore = {};
  isDisplay = false;
  isWorkExperienceFormVisible = false;
  isEducationFormVisible = false;


  hidePopUp() {
    this.isWorkExperienceFormVisible = false;
  }


  showMoreItems(sectionTitle: string) {
    this.showMore[sectionTitle] = true;
  }
  showLessItems(sectionTitle: string) {
    this.showMore[sectionTitle] = false;
  }
  user = {
    name: 'John Doe',
    description: 'A creative web developer with 5 years of experience.',
    profilePicture: 'https://via.placeholder.com/150',
    sections: [
      {
        title: 'Work Experience',
        items: ['Software Engineer at XYZ', 'Web Developer at ABC']
      },
      {
        title: 'Education',
        items: ['B.S. in Computer Science, University of Example']
      },
      {
        title: 'Skills',
        items: ['HTML', 'CSS', 'JavaScript', 'Angular', 'React']
      },
      {
        title: 'Languages',
        items: ['English', 'Spanish']
      }
    ]
  };
  isSkillFormVisible = false;

  ngOnInit(): void {
  }

  showPopUp(title: string) {
    console.log(title);
    switch (title){
      case 'Work Experience': this.isWorkExperienceFormVisible = true;break;
      case 'Skills': this.isSkillFormVisible = true;break;
      case 'Education': this.isEducationFormVisible = true;
      }
  }
}
