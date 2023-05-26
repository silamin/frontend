import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-process-application',
  templateUrl: './process-application.component.html',
  styleUrls: ['./process-application.component.scss']
})
export class ProcessApplicationComponent implements OnInit{
  ngOnInit(): void {
    window.onload = () => {
      const steps = document.getElementsByClassName("process-step");
      const progressBar = document.getElementById("process-progress") as HTMLDivElement;

      const stepCompleted = (index: number) => {
        let progress = (index / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
      }

      for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let button = step.querySelector("button");

        if (button) {
          button.onclick = () => stepCompleted(i + 1);
        }
      }
    }
  }
}
