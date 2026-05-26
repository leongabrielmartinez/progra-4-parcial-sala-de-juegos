import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/shared/header/header";
import { StickyChat } from './components/shared/sticky-chat/sticky-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, StickyChat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('progra-4-parcial-sala-de-juegos');
}
