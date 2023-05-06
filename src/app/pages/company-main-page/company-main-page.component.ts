import { Component } from "@angular/core";

@Component({
  selector: 'app-company-main-page',
  templateUrl: './company-main-page.component.html',
  styleUrls: ['./company-main-page.component.scss'],
})
export class CompanyMainPageComponent {
  itemsPerPage = 3;
  currentPage = 1;

  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.jobs.slice(startIndex, endIndex);
  }

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
  }
  candidatesPosition: { top: string, left: string } = { top: '0', left: '0' };
  isVisible = false;

  jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'ABC Inc.',
      description: 'We are seeking a highly skilled software engineer to join our team. The ideal candidate will have experience with Angular and Node.js.',
      candidates: [
        {
          name: 'John Doe',
          experience: 5,
          summary: 'Software engineer with 5 years of experience in Angular and Node.js.',
          education: 'B.S. in Computer Science from XYZ University'
        },
        {
          name: 'Jane Smith',
          experience: 7,
          summary: 'Senior software engineer with 7 years of experience in Angular and Node.js.',
          education: 'M.S. in Computer Science from ABC University'
        }
      ]
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'XYZ Corp.',
      description: 'We are looking for an experienced marketing manager to lead our team. The ideal candidate will have a proven track record of driving successful campaigns.',
      candidates: [
        {
          name: 'Mike Johnson',
          experience: 7,
          summary: 'Marketing manager with 7 years of experience developing successful campaigns.',
          education: 'B.A. in Marketing from XYZ University'
        },
        {
          name: 'Sarah Lee',
          experience: 4,
          summary: 'Marketing specialist with 4 years of experience in digital marketing.',
          education: 'B.S. in Marketing from 123 University'
        }
      ]
    },
    {
      id: 3,
      title: 'Sales Representative',
      company: '123 Co.',
      description: 'We are seeking a driven sales representative to help us grow our business. The ideal candidate will have excellent communication skills and a proven track record of hitting sales targets.',
      candidates: [
        {
          name: 'Tom Brown',
          experience: 3,
          summary: 'Sales representative with 3 years of experience in B2B sales.',
          education: 'B.S. in Business Administration from ABC University'
        },
        {
          name: 'Emily Chen',
          experience: 5,
          summary: 'Sales manager with 5 years of experience in B2C sales.',
          education: 'M.B.A. in Marketing from XYZ University'
        }
      ]
    },
    {
      id: 1,
      title: 'Software Engineer',
      company: 'ABC Inc.',
      description: 'We are seeking a highly skilled software engineer to join our team. The ideal candidate will have experience with Angular and Node.js.',
      candidates: [
        {
          name: 'John Doe',
          experience: 5,
          summary: 'Software engineer with 5 years of experience in Angular and Node.js.',
          education: 'B.S. in Computer Science from XYZ University'
        },
        {
          name: 'Jane Smith',
          experience: 7,
          summary: 'Senior software engineer with 7 years of experience in Angular and Node.js.',
          education: 'M.S. in Computer Science from ABC University'
        }
      ]
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'XYZ Corp.',
      description: 'We are looking for an experienced marketing manager to lead our team. The ideal candidate will have a proven track record of driving successful campaigns.',
      candidates: [
        {
          name: 'Mike Johnson',
          experience: 7,
          summary: 'Marketing manager with 7 years of experience developing successful campaigns.',
          education: 'B.A. in Marketing from XYZ University'
        },
        {
          name: 'Sarah Lee',
          experience: 4,
          summary: 'Marketing specialist with 4 years of experience in digital marketing.',
          education: 'B.S. in Marketing from 123 University'
        }
      ]
    },
    {
      id: 3,
      title: 'Sales Representative',
      company: '123 Co.',
      description: 'We are seeking a driven sales representative to help us grow our business. The ideal candidate will have excellent communication skills and a proven track record of hitting sales targets.',
      candidates: [
        {
          name: 'Tom Brown',
          experience: 3,
          summary: 'Sales representative with 3 years of experience in B2B sales.',
          education: 'B.S. in Business Administration from ABC University'
        },
        {
          name: 'Emily Chen',
          experience: 5,
          summary: 'Sales manager with 5 years of experience in B2C sales.',
          education: 'M.B.A. in Marketing from XYZ University'
        }
      ]
    }
  ];

  selectedJob: any = null;
  navItems = [
    { title: 'Home', href: '', icon: 'fa-home', active: true },
    { title: 'Post a job', href: '', icon: 'fa-plus' },
    { title: 'Messages', href: '', icon: 'fa-envelope' },
    { title: 'Log out', href: '', icon: 'fa-sign-out-alt' },
  ];
  jobPopupVisible = false;
  isDisplay = false;
  showCandidates(jobIndex: number, rowIndex: number) {
    this.selectedJob = this.jobs[jobIndex];
    const card = document.getElementById(`card-${jobIndex}-${rowIndex}`);
    if (card) {
      const cardPosition = card.getBoundingClientRect();
      const dropdownHeight = document.getElementById('candidates-dropdown')?.offsetHeight;
      const cardHeight = card.offsetHeight;
      const cardTop = cardPosition.top;
      const windowHeight = window.innerHeight;
      let dropdownTop = cardTop + cardHeight;
      if (dropdownHeight)
      if (dropdownTop + dropdownHeight > windowHeight) {
        dropdownTop = windowHeight - dropdownHeight;
      }
      this.candidatesPosition = {
        top: `${dropdownTop}px`,
        left: `${cardPosition.left}px`,
      };
      this.isVisible = true;
      const rowBelow = document.getElementById(`row-${jobIndex}-${rowIndex + 1}`);
      if (rowBelow) {
        const rowHeight = rowBelow.offsetHeight;
        rowBelow.style.position = 'relative';
        if (dropdownHeight)
        rowBelow.style.top = `${dropdownHeight + cardHeight - rowHeight}px`;
      }
    }
    }

  closeCandidates() {
    this.selectedJob = null;
    this.isVisible = false;
  }

  hideJobPopUp() {
    this.jobPopupVisible = false;
  }
}