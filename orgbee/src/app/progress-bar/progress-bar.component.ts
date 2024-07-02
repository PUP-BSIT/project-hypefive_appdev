import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../../service/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  loadingProgress: number = 0; // Initialize to 0 or your desired initial value
  private loadingSubscription: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (this.isLoading) {
        this.startProgress();
      } else {
        this.completeProgress();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  private startProgress() {
    this.loadingProgress = 0; // Reset progress when loading starts
    const interval = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += 1; // Increase progress value
      } else {
        clearInterval(interval);
      }
    }, 20); // Adjust interval as needed for smooth animation
  }

  private completeProgress() {
    // Simulate a slight delay to show completion
    setTimeout(() => {
      this.loadingProgress = 100; // Complete progress
    }, 500); // Adjust delay as needed
  }
}
