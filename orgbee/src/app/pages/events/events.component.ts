import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const createEventBtn = document.getElementById(
        'createEventBtn'
      ) as HTMLElement;
      const modal = document.getElementById('eventFormModal') as HTMLElement;
      const closeBtn = document.querySelector('.close') as HTMLElement;
      const formSections = document.querySelectorAll('.form-section');
      const nextButtons = document.querySelectorAll('.next-btn');
      const backButtons = document.querySelectorAll('.back-btn');
      const finalButtons = document.getElementById(
        'finalButtons'
      ) as HTMLElement;

      // Function to show modal
      function showModal(): void {
        modal.style.display = 'block';
        showFormSection(0);
      }

      // Function to close modal
      function closeModal(): void {
        modal.style.display = 'none';
      }

      // Function to show a specific form section and hide others
      function showFormSection(index: number): void {
        formSections.forEach((section: Element, i: number) => {
          if (i === index) {
            section.classList.add('visible');
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
            section.classList.remove('visible');
          }
        });
        // Show final buttons only after the last form section
        if (index === formSections.length) {
          finalButtons.classList.remove('hidden');
        } else {
          finalButtons.classList.add('hidden');
        }
      }

      // Event listener for create event button
      createEventBtn.addEventListener('click', showModal);

      // Event listener for close button
      closeBtn.addEventListener('click', closeModal);

      // Event listeners for next buttons
      nextButtons.forEach((button: Element, index: number) => {
        button.addEventListener('click', () => {
          if (index < formSections.length - 1) {
            showFormSection(index + 1);
          } else {
            showFormSection(formSections.length);
          }
        });
      });

      // Event listeners for back buttons
      backButtons.forEach((button: Element, index: number) => {
        button.addEventListener('click', () => {
          if (index < formSections.length) {
            showFormSection(index);
          } else {
            showFormSection(formSections.length - 1);
          }
        });
      });

      // Event listener for radio buttons to show/hide registration fee input
      const regFeeYes = document.getElementById(
        'regFeeYes'
      ) as HTMLInputElement;
      const regFeeInput = document.getElementById('regAmount') as HTMLElement;
      regFeeYes.addEventListener('change', () => {
        regFeeInput.classList.remove('hidden');
      });
      const regFeeNo = document.getElementById('regFeeNo') as HTMLInputElement;
      regFeeNo.addEventListener('change', () => {
        regFeeInput.classList.add('hidden');
      });

      // From this part it will be move after further implementation
      // Example event data to just see how it could look like
      const events = [
        {
          title: 'Event Title 1',
          date: 'May 30, 2024',
          location: 'Venue 1',
          registered: true,
        },
        {
          title: 'Event Title 2',
          date: 'June 15, 2024',
          location: 'Venue 2',
          registered: false,
        },
      ];

      // Function to display events based on selected tab
      function displayEvents(tab: string): void {
        const eventList = document.querySelector('.event-list') as HTMLElement;
        eventList.innerHTML = '';

        const filteredEvents = events.filter((event) => {
          return true;
        });

        filteredEvents.forEach((event) => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
          if (event.registered) {
            eventCard.classList.add('registered');
          }

          eventCard.innerHTML = `
                    <img src="event-image.jpg" alt="${event.title}">
                    <div>
                        <h2>${event.title}</h2>
                        <p>${event.date} | ${event.location}</p>
                        <button class="register-button">Register</button>
                    </div>
                `;

          eventList.appendChild(eventCard);
        });
      }

      //will further improve in next prints
      // Event listener for tab clicks
      document.querySelectorAll('.tab').forEach((tab: Element) => {
        tab.addEventListener('click', function () {
          const selectedTab = (this as HTMLElement).textContent;
          displayEvents(selectedTab);
        });
      });

      // Initial display
      displayEvents('UPCOMING');
    });
  }
}
