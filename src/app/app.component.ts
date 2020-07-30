import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public boardWidth;
  public boardheight;
  public avatar: HTMLImageElement;
  public avatarTop: number;
  public avatarLeft: number;
  public numberOfSteps = 0;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: { boardWidth: this.boardWidth, boardheight: this.boardheight },
      disableClose: true
    });
    const instance = dialogRef.componentInstance;
    dialogRef.afterClosed().subscribe(result => {
      this.boardWidth = instance.boardWidth;
      this.boardheight = instance.boardheight;
      this.createGrid();
      this.placeCoins();
      this.placeAvatar();
    });
  }

  createGrid() {
    const board = document.querySelector('#board');
    for (let i = 0; i < this.boardheight; i++) {
      const parentDiv = document.createElement('div');
      parentDiv.classList.add('row');
      for (let j = 0; j < this.boardWidth; j++) {
        const div = document.createElement('div');
        div.classList.add('box');
        parentDiv.append(div);
      }
      board.append(parentDiv);
    }
  }

  createAvatar(): HTMLImageElement {
    const avatar = document.createElement('img');
    avatar.src = 'assets/mario.jpg';
    avatar.id = 'avatar';
    avatar.classList.add('avatar');
    return avatar;
  }

  createCoin(): HTMLImageElement {
    const coin = document.createElement('img');
    coin.src = 'assets/coin.gif';
    coin.classList.add('coin');
    return coin;
  }

  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  placeCoins() {
    const board = document.querySelector('#board');
    for (let i = 0; i < this.boardWidth; i++) {
      const randomColumnPosition = Math.floor(Math.random() * this.boardheight);
      const randomRowPosition = Math.floor(Math.random() * this.boardWidth);
      board.childNodes[randomColumnPosition].childNodes[randomRowPosition].appendChild(this.createCoin());
    }
  }

  placeAvatar() {
    const board = document.querySelector('#board');

    const columnMid = Math.round(this.boardheight / 2);
    const rowMid = Math.round(this.boardWidth / 2);
    const differenceOfOneOrTwo = this.randomInteger(1, 2);

    // Creating random points at center to place the avatar
    let randomColumnPosition = Math.floor(this.randomInteger(columnMid - differenceOfOneOrTwo, rowMid - differenceOfOneOrTwo));
    let randomRowPosition = Math.floor(this.randomInteger(columnMid - differenceOfOneOrTwo, rowMid - differenceOfOneOrTwo));
    if (board.childNodes[randomColumnPosition].childNodes[randomRowPosition].childNodes.length === 0) {
      board.childNodes[randomColumnPosition].childNodes[randomRowPosition].appendChild(this.createAvatar());
    } else {
      randomColumnPosition = Math.floor(this.randomInteger(columnMid - differenceOfOneOrTwo, rowMid - differenceOfOneOrTwo));
      randomRowPosition = Math.floor(this.randomInteger(columnMid - differenceOfOneOrTwo, rowMid - differenceOfOneOrTwo));
      board.childNodes[randomColumnPosition].childNodes[randomRowPosition].appendChild(this.createAvatar());
    }
  }

  @HostListener('window:keyup', ['$event'])
  moveAvatar(e: KeyboardEvent) {
    const avatar = document.getElementById('avatar');
    const board = document.querySelector('#board');
    const coins: HTMLCollection = document.getElementsByClassName('coin');
    if (e.target === document.body) {
      const position = this.findPosition(avatar);
      avatar.style.top = (position.curtop).toString();
      avatar.style.left = (position.curleft).toString();
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        this.moveVertical(avatar, 100);
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        this.moveVertical(avatar, -100);
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.moveHorizontal(avatar, 100);
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.moveHorizontal(avatar, -100);
      }
      for (let i = 0; i < coins.length; i++) {
        if (this.isTouching(avatar, coins[i])) {
          coins[i].parentElement.removeChild(coins[i]);
        }
      }
      if (coins.length === 0) {
        // Adding timeout so alert message pops after the avatar moves in the box
        setTimeout(() => {
          alert(`You have taken ${this.numberOfSteps} steps to complete the game!`);
        }, 1000);
      }
    }
  }

  isTouching(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      aRect.top + aRect.height < bRect.top ||
      aRect.top > bRect.top + bRect.height ||
      aRect.left + aRect.width < bRect.left ||
      aRect.left > bRect.left + bRect.width
    );
  }

  findPosition(obj) {
    let curleft = 0;
    let curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { curleft, curtop };
    }
  }


  moveVertical(element, amount) {
    const currTop = this.findPosition(element).curtop;
    if (amount > 0) {
      if (currTop < (100 * (this.boardheight - 1))) {
        element.style.top = `${currTop + amount}px`;
        this.numberOfSteps++;
      }
    } else {
      if (currTop > 100) {
        element.style.top = `${currTop + amount}px`;
        this.numberOfSteps++;
      }
    }
  }

  moveHorizontal(element, amount) {
    const currLeft = this.findPosition(element).curleft;
    if (amount > 0) {
      if (currLeft < (100 * (this.boardWidth - 1))) {
        element.style.left = `${currLeft + amount}px`;
        this.numberOfSteps++;
      }
    } else {
      if (currLeft > 100) {
        element.style.left = `${currLeft + amount}px`;
        this.numberOfSteps++;
      }
    }
  }
}


