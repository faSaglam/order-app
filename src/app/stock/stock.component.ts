import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  template: `
    <div class="container text-center">
      <div class="row">
        <div class="col-4">
          <h1>Stock</h1>
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th scope="col">Malzeme</th>
                <th scope="col">Adet</th>
              </tr>
            </thead>
            <tbody *ngFor="let item of stock">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-8">
          <h1>Kiosk</h1>
          <div *ngIf="canIOrder">
            <button class="btn btn-dark" (click)="order()">Order</button>

            <p>{{ checkMessage }}</p>
          </div>
          <div *ngIf="!canIOrder">Yeni sipariş alınamamaktadır.</div>
          <div *ngIf="orderValue" class="container">
            <div *ngIf="mainIngredients">
              <div class="row">
                <div class="col">
                  <div>
                    <!--Köfte-->
                    <button
                      class="btn btn-warning"
                      [disabled]="isDisabledMeat ? 'disabled' : null"
                      (click)="orderHamburger()"
                    >
                      Köfte
                    </button>
                    <form *ngIf="selectedHamburger">
                      <div
                        class="form-check"
                        *ngFor="let item of stock | slice: 0:5"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          (click)="selectMetarial(item.id)"
                          [disabled]="item.quantity <= 0 ? true : null"
                        />
                        <label class="form-check-label">{{ item.name }} </label>
                      </div>
                    </form>
                    <form
                      *ngIf="selectedHamburger"
                      (ngSubmit)="orderAnHamburger(selectedHeat)"
                    >
                      <label for="heatControl"
                        >Hamburgeriniz nasıl olsun?</label
                      >
                      <select
                        [(ngModel)]="selectedHeat"
                        [ngModelOptions]="{ standalone: true }"
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option *ngFor="let kind of meatball" [value]="kind.id">
                          {{ kind.heat }}
                        </option>
                      </select>

                      <button
                        class="btn btn-primary"
                        type="submit"
                        [disabled]="isDisabledMeat ? 'disabled' : null"
                      >
                        Onayla
                      </button>
                    </form>
                  </div>
                  <div *ngIf="cookingMeatball">
                    {{ meatballMessage }} -- {{ patatoMessage }} --
                    {{ drinkMessage }}
                  </div>
                </div>
                <div class="col">
                  <button
                    class="btn btn-warning"
                    [disabled]="isDisabledChicken ? true : null"
                    (click)="orderChicken()"
                  >
                    Tavuk
                  </button>
                  <form
                    *ngIf="selectedChicken && !selectedHamburger"
                    (ngSubmit)="orderAnChicken()"
                  >
                    <div
                      class="form-check"
                      *ngFor="let item of stock | slice: 0:5"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        (click)="selectMetarial(item.id)"
                        [disabled]="item.quantity <= 0 ? true : null"
                      />
                      <label class="form-check-label">
                        {{ item.name }}
                      </label>
                    </div>

                    <button class="btn btn-primary" type="submit">
                      Onayla
                    </button>
                  </form>
                  <div *ngIf="cookingChicken">
                    {{ chickenMessage }}-{{ patatoMessage }}--{{ drinkMessage }}
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="orderValue">
              <div *ngIf="mainIngredients">
                <div *ngIf="tray">
                  <hr />
                  <p>{{ trayMessage }}</p>
                  <button
                    class="btn btn-primary"
                    *ngIf="newOrderButton"
                    (click)="newOrder()"
                  >
                    Yeni Sipariş Ver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Temel içerikler varsa bir sonraki aşamaya git Ekmek vs. yoksa zaten hiç birşey yapılamaz-->
      </div>
    </div>
  `,
  styles: [],
})
export class StockComponent implements OnInit {
  //STOCK
  public stock: {
    id: number;
    name: string;
    quantity: number;
  }[] = [
    { id: 1, name: 'marul', quantity: 5 },
    { id: 2, name: ' turşu', quantity: 5 },
    { id: 3, name: 'paket sos', quantity: 5 },
    { id: 4, name: ' soğan', quantity: 5 },
    { id: 5, name: 'domates', quantity: 5 },
    { id: 6, name: 'tavuk', quantity: 5 },
    { id: 7, name: 'köfte', quantity: 5 },
    { id: 8, name: 'ekmek', quantity: 5 },
    { id: 9, name: 'patates', quantity: 5 },
    { id: 10, name: 'cola', quantity: 5 },
  ];

  public meatball: { id: number; heat: string }[] = [
    { id: 1, heat: 'rare' },
    { id: 2, heat: 'well' },
    { id: 3, heat: 'well-done' },
  ];
  //DEĞİŞİME BAĞLI DEĞERLER
  orderTime: any = 0;
  canIOrder: boolean = true;
  mainIngredients: boolean = false;
  public checkMessage: string = '';
  // isDisabled: boolean = false;
  isDisabledMeat: boolean = false;
  isDisabledChicken: boolean = false;
  checkList: boolean = false;
  cookingMeatball: boolean = false;
  cookingChicken: boolean = false;

  public orderValue: boolean = false;

  selectedHamburger: boolean = false;
  selectedChicken: boolean = false;

  selectedHeat: string | undefined;
  printedHeat: string | undefined;

  constructor() {}

  ngOnInit(): void {}
  //SİPARİŞ FONKSİYONU STEP 1-2

  order() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.orderValue = true;

        resolve('');
        this.stockControl();
      }, 1000);
    });
  }
  stockControl() {
    this.checkMessage = 'Malzeme kontrolü yapılıyor';
    const bread = this.stock.findIndex((item) => item.id == 8);
    const patato = this.stock.findIndex((item) => item.id == 9);
    const cola = this.stock.findIndex((item) => item.id == 9);
    const meatball = this.stock.findIndex((item) => item.id == 7);
    const chicken = this.stock.findIndex((item) => item.id == 6);
    setTimeout(() => {
      if (
        this.stock[bread].quantity == 0 ||
        this.stock[patato].quantity == 0 ||
        this.stock[cola].quantity == 0
      ) {
        this.checkMessage = 'Ana malzeme yok- yeni sipariş alınamamaktadır.';
        alert('Ana malzeme yok- yeni sipariş alınamamaktadır');
        this.isDisabledChicken = true;
        this.isDisabledMeat = true;
      }
      if (this.stock[meatball].quantity == 0) {
        this.checkMessage = 'Köfte siparişi veremezsiniz';
        alert('köfte siparişi veremezsiniz');
        this.mainIngredients = true;
        this.isDisabledMeat = true;
      }
      if (this.stock[chicken].quantity == 0) {
        this.checkMessage = 'Tavuk siparişi veremezsiniz';
        alert('tavuk siparişi veremezsiniz');
        this.mainIngredients = true;
        this.isDisabledChicken = true;
      } else this.mainIngredients = true;
      this.checkMessage = '';
    }, 3000);
  }

  //KÖFTE SEÇİLİRSE

  orderHamburger() {
    this.selectedHamburger = true;
    this.checkList;
  }

  patatoMessage = 'Patatesler kızartılıyor';
  drinkMessage = 'Kolanız dolduruluyor';
  meatballMessage = 'Hamburgeriniz hazırlanıyor';

  selectMetarial(id: number) {
    const selectedItem = this.stock.findIndex((item) => item.id == id);
    this.stock[selectedItem].quantity -= 1;
  }

  orderAnHamburger(heat: any) {
    this.cookingMeatball = true;

    const meatball = this.stock.findIndex((item) => item.id == 7);

    const bread = this.stock.findIndex((item) => item.id == 8);
    const patato = this.stock.findIndex((item) => item.id == 9);
    const cola = this.stock.findIndex((item) => item.id == 10);
    this.selectedHeat = heat;
    if (this.stock[meatball].quantity > 0) {
      return new Promise((resolve, reject) => {
        if (heat == 1) {
          setTimeout(() => {
            this.drinkMessage = 'İçeceğiniz hazır';
            this.stock[cola].quantity -= 1;
          }, 2000);
          setTimeout(() => {
            this.patatoMessage = 'Patetesler hazır';
            this.stock[patato].quantity -= 1;
            this.setTray();
          }, 5000);
          setTimeout(() => {
            this.meatballMessage = 'Hamburgeriniz hazır';
            this.stock[meatball].quantity -= 1;
            this.stock[bread].quantity -= 1;
          }, 4000);
        } else if (heat == 2) {
          setTimeout(() => {
            this.drinkMessage = 'İçeceğiniz hazır';
            this.stock[cola].quantity -= 1;
          }, 2000);
          setTimeout(() => {
            this.patatoMessage = 'Patetesler hazır';
            this.stock[patato].quantity -= 1;
          }, 5000);
          setTimeout(() => {
            //pişirme + ekmeği hazırlama süresi
            this.meatballMessage = 'Hamburgeriniz hazır';
            this.stock[meatball].quantity -= 1;
            this.stock[bread].quantity -= 1;
            this.setTray();
          }, 5000);
        } else if (heat == 3) {
          setTimeout(() => {
            this.drinkMessage = 'İçeceğiniz hazır';
            this.stock[cola].quantity -= 1;
          }, 2000);
          setTimeout(() => {
            this.patatoMessage = 'Patetesler hazır';
            this.stock[patato].quantity -= 1;
          }, 5000);
          setTimeout(() => {
            //pişirme + ekmeği hazırlama süresi
            this.meatballMessage = 'Hamburgeriniz hazır';
            this.stock[meatball].quantity -= 1;
            this.stock[bread].quantity -= 1;
            this.setTray();
          }, 6000);
        }
      });
    }
    return (
      (this.isDisabledMeat = false),
      alert('Köfte bitti.Köfte siparişi veremezsiniz')
    );
  }
  chickenMessage: string = 'Tavuğunuz hazırlanıyor';
  //Tavuk Seçilirse
  orderChicken() {
    this.selectedHamburger = false;
    this.selectedChicken = true;
  }
  orderAnChicken() {
    this.cookingChicken = true;
    const chicken = this.stock.findIndex((item) => item.id == 6);
    const bread = this.stock.findIndex((item) => item.id == 8);
    const patato = this.stock.findIndex((item) => item.id == 9);
    const cola = this.stock.findIndex((item) => item.id == 10);
    if (this.stock[chicken].quantity > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.drinkMessage = 'İçeceğiniz hazır';
          this.stock[cola].quantity -= 1;
        }, 2000);
        setTimeout(() => {
          this.patatoMessage = 'Patetesler hazır';
          this.stock[patato].quantity -= 1;
          this.setTray();
        }, 5000);
        setTimeout(() => {
          this.chickenMessage = 'Tavuğunuz hazır';
          this.stock[chicken].quantity -= 1;
          this.stock[bread].quantity -= 1;
        }, 4000);
      });
    }
    return (this.isDisabledChicken = false), alert('Tavuk stoğu bitti.');
  }

  tray: boolean = false;

  trayMessage = 'Ürünler tepsiye koyuluyor';

  newOrderButton = false;

  setTray() {
    this.tray = true;
    setTimeout(() => {
      this.trayMessage = 'Siparişiniz Hazır';
      console.log('sipariş hazır');
      this.newOrderButton = true;
    }, 3000);
  }
  newOrder() {
    this.orderValue = false;
  }
}
