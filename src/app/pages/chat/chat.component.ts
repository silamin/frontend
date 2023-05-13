import { Component } from '@angular/core';
interface Discussion {
  id: number;
  title: string;
}

interface Message {
  id: number;
  discussionId: number;
  sender: string;
  content: string;
  imageUrl: string;
  createdAt: number;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  currentUser = {
    name: 'User 1',
    imageUrl: 'https://via.placeholder.com/50',
  };  isTyping = false;

  discussions: Discussion[] = [
    { id: 1, title: 'Discussion 1' },
    { id: 2, title: 'Discussion 2' },
    { id: 3, title: 'Discussion 3' },
  ];
  navItems = [
    { jobTitle: 'Home', href: '', icon: 'fa-home', active: true },
    { jobTitle: 'Profile', href: '', icon: 'fa-user' },
    { jobTitle: 'Liked jobs', href: '', icon: 'fa-heart' },
    { jobTitle: 'Messages', href: '', icon: 'fa-envelope' },
    { jobTitle: 'Log out', href: '', icon: 'fa-sign-out-alt' },

  ];
  messages: Message[] = [
    { id: 1, discussionId: 1, sender: 'User 1', content: 'Hello, how are you?', imageUrl: 'https://via.placeholder.com/40', createdAt: Date.now() },
    { id: 2, discussionId: 1, sender: 'User 2', content: 'Hi, I am fine, thank you!', imageUrl: 'https://via.placeholder.com/40', createdAt: Date.now() },
    { id: 3, discussionId: 2, sender: 'User 3', content: 'Hey, what is the status of the project?', imageUrl: 'https://via.placeholder.com/40', createdAt: Date.now() },
  ];

  selectedDiscussionId: number | null = null;

  selectDiscussion(discussionId: number) {
    this.selectedDiscussionId = discussionId;
  }

  getSelectedDiscussionMessages(): Message[] {
    return this.messages.filter(message => message.discussionId === this.selectedDiscussionId);
  }

  sendMessage(): void {
    const input = document.querySelector('.message-input input') as HTMLInputElement;
    if (input.value) {
      this.messages.push({
        id: this.messages.length + 1,
        discussionId: this.selectedDiscussionId!,
        sender: this.currentUser.name,
        content: input.value,
        imageUrl: 'https://via.placeholder.com/40',
        createdAt: Date.now()
      });
      input.value = '';
      this.isTyping = false;
    }
  }

  isCurrentUser(senderName: string) {
    return senderName === this.currentUser.name;
  }

  messageSentTime(message: Message): string {
    const date = new Date(message.createdAt);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true } as Intl.DateTimeFormatOptions;
    return date.toLocaleString('en-US', timeOptions);
  }

  typingTimer: any;
  onTyping(event: Event): void {
    const input = event.target as HTMLInputElement;
    clearTimeout(this.typingTimer);
    if (input.value) {
      this.isTyping = true;
      this.typingTimer = setTimeout(() => {
        this.isTyping = false;
      }, 3000);
    } else {
      this.isTyping = false;
    }
  }
}
