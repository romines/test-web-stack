import 'cypress-plugin-tab';

describe('End to end tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('search bar updates query string', () => {
    cy.get('.top-bar input').should('be.visible').type('John Doe');

    cy.location().should((loc) => {
      expect(loc.search).to.eq('?q=John+Doe');
    });
  });
});
