import {AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent{
  constructor(private elRef: ElementRef) {}

  isVisible = false;

  showPopUp() {
    this.isVisible = true;
  }

  hidePopUp() {
    this.isVisible = false;
  }

  showButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if user has scrolled down
    this.showButton = window.pageYOffset > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  description: string = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n';
  editMode: boolean = false;
  editIcon = faEdit;
  saveIcon = faSave;


  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  }
