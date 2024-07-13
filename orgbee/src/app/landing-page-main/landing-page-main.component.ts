import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page-main',
  templateUrl: './landing-page-main.component.html',
  styleUrls: ['./landing-page-main.component.css']
})
export class LandingPageMainComponent {
  isNavbarHidden = false;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isNavbarHidden = currentScrollTop > 
      this.lastScrollTop && currentScrollTop > 80; 
    // For Mobile or negative scrolling
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
  }
}
