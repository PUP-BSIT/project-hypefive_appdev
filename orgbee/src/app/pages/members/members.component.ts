import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})

export class MembersComponent implements OnInit {
  ngOnInit() {
    this.addEventListeners();
  }

  addEventListeners() {
    const members = document.querySelectorAll('.member');
    const modal = document.getElementById('memberModal') as HTMLElement;
    const span = document.getElementsByClassName('close')[0] as HTMLElement;
    const removeButton = modal.querySelector('button.remove') as HTMLButtonElement;

    members.forEach(member => {
      member.addEventListener('click', (event) => {
        const memberName = (member.querySelector('#name') as HTMLElement).innerText;
        const memberIconSrc = (member.querySelector('img') as HTMLImageElement).src;

        (document.getElementById('modal-name') as HTMLElement).innerText = memberName;
        (document.getElementById('modal-icon') as HTMLImageElement).src = memberIconSrc;

        modal.style.display = 'block';
      });
    });

    span.onclick = function () {
      modal.style.display = 'none';
    };

    removeButton.addEventListener('click', () => {
      const memberName = (document.getElementById('modal-name') as HTMLElement).innerText;
      console.log(`Remove member: ${memberName}`);
      modal.style.display = 'none';
    });

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
}
