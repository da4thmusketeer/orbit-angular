import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.05 }
      );
      this.revealElements.forEach((element) => this.observer?.observe(element.nativeElement));
    } else {
      this.revealElements.forEach((element) => element.nativeElement.classList.add('visible'));
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
