import { ClientPage } from './app.po';

describe('client App', function() {
  let page: ClientPage;

  beforeEach(() => {
    page = new ClientPage();
  });

  it('should display message saying OnlineChat', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('OnlineChat');
  });
});
