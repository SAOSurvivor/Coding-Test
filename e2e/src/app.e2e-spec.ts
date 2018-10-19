'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of sales';
const expectedTitle = `${expectedH1}`;
const targetsale = { id: 15, name: 'Magneta' };
const targetsaleDashboardIndex = 3;
const nameSuffix = 'X';
const newsaleName = targetsale.name + nameSuffix;

class sale {
  id: number;
  name: string;

  // Factory methods

  // sale from string formatted as '<id> <name>'.
  static fromString(s: string): sale {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // sale from sale list <li> element.
  static async fromLi(li: ElementFinder): Promise<sale> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // sale id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<sale> {
    // Get sale id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topsales: element.all(by.css('app-root app-dashboard > div h4')),

      appsalesHref: navElts.get(1),
      appsales: element(by.css('app-root app-sales')),
      allsales: element.all(by.css('app-root app-sales li')),
      selectedsaleSubview: element(by.css('app-root app-sales > div:last-child')),

      saleDetail: element(by.css('app-root app-sale-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'sales'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top sales', () => {
      let page = getPageElts();
      expect(page.topsales.count()).toEqual(4);
    });

    it(`selects and routes to ${targetsale.name} details`, dashboardSelectTargetsale);

    it(`updates sale name (${newsaleName}) in details view`, updatesaleNameInDetailView);

    it(`cancels and shows ${targetsale.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetsaleElt = getPageElts().topsales.get(targetsaleDashboardIndex);
      expect(targetsaleElt.getText()).toEqual(targetsale.name);
    });

    it(`selects and routes to ${targetsale.name} details`, dashboardSelectTargetsale);

    it(`updates sale name (${newsaleName}) in details view`, updatesaleNameInDetailView);

    it(`saves and shows ${newsaleName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetsaleElt = getPageElts().topsales.get(targetsaleDashboardIndex);
      expect(targetsaleElt.getText()).toEqual(newsaleName);
    });

  });

  describe('sales tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to sales view', () => {
      getPageElts().appsalesHref.click();
      let page = getPageElts();
      expect(page.appsales.isPresent()).toBeTruthy();
      expect(page.allsales.count()).toEqual(10, 'number of sales');
    });

    it('can route to sale details', async () => {
      getsaleLiEltById(targetsale.id).click();

      let page = getPageElts();
      expect(page.saleDetail.isPresent()).toBeTruthy('shows sale detail');
      let sale = await sale.fromDetail(page.saleDetail);
      expect(sale.id).toEqual(targetsale.id);
      expect(sale.name).toEqual(targetsale.name.toUpperCase());
    });

    it(`updates sale name (${newsaleName}) in details view`, updatesaleNameInDetailView);

    it(`shows ${newsaleName} in sales list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetsale.id} ${newsaleName}`;
      expect(getsaleAEltById(targetsale.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newsaleName} from sales list`, async () => {
      const salesBefore = await tosaleArray(getPageElts().allsales);
      const li = getsaleLiEltById(targetsale.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appsales.isPresent()).toBeTruthy();
      expect(page.allsales.count()).toEqual(9, 'number of sales');
      const salesAfter = await tosaleArray(page.allsales);
      // console.log(await sale.fromLi(page.allsales[0]));
      const expectedsales =  salesBefore.filter(h => h.name !== newsaleName);
      expect(salesAfter).toEqual(expectedsales);
      // expect(page.selectedsaleSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetsale.name}`, async () => {
      const newsaleName = 'Alice';
      const salesBefore = await tosaleArray(getPageElts().allsales);
      const numsales = salesBefore.length;

      element(by.css('input')).sendKeys(newsaleName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let salesAfter = await tosaleArray(page.allsales);
      expect(salesAfter.length).toEqual(numsales + 1, 'number of sales');

      expect(salesAfter.slice(0, numsales)).toEqual(salesBefore, 'Old sales are still there');

      const maxId = salesBefore[salesBefore.length - 1].id;
      expect(salesAfter[numsales]).toEqual({id: maxId + 1, name: newsaleName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in sales.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive sale search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetsale.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let sale = page.searchResults.get(0);
      expect(sale.getText()).toEqual(targetsale.name);
    });

    it(`navigates to ${targetsale.name} details view`, async () => {
      let sale = getPageElts().searchResults.get(0);
      expect(sale.getText()).toEqual(targetsale.name);
      sale.click();

      let page = getPageElts();
      expect(page.saleDetail.isPresent()).toBeTruthy('shows sale detail');
      let sale2 = await sale.fromDetail(page.saleDetail);
      expect(sale2.id).toEqual(targetsale.id);
      expect(sale2.name).toEqual(targetsale.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetsale() {
    let targetsaleElt = getPageElts().topsales.get(targetsaleDashboardIndex);
    expect(targetsaleElt.getText()).toEqual(targetsale.name);
    targetsaleElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.saleDetail.isPresent()).toBeTruthy('shows sale detail');
    let sale = await sale.fromDetail(page.saleDetail);
    expect(sale.id).toEqual(targetsale.id);
    expect(sale.name).toEqual(targetsale.name.toUpperCase());
  }

  async function updatesaleNameInDetailView() {
    // Assumes that the current view is the sale details view.
    addTosaleName(nameSuffix);

    let page = getPageElts();
    let sale = await sale.fromDetail(page.saleDetail);
    expect(sale.id).toEqual(targetsale.id);
    expect(sale.name).toEqual(newsaleName.toUpperCase());
  }

});

function addTosaleName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getsaleAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getsaleLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function tosaleArray(allsales: ElementArrayFinder): Promise<sale[]> {
  let promisedsales = await allsales.map(sale.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedsales);
}
