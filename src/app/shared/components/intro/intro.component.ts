import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: false,
})
export class IntroComponent {
  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  onSubmit(event: Event) {
    event.preventDefault();
    alert('Thank you for reaching out! We will get back to you shortly.');
    // In real app, form submission logic would go here
  
}
}