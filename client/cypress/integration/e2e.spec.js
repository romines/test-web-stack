import 'cypress-plugin-tab';

function seedDb() {
  // npx sqlite3 is not working on Node 16 for some reason, so skip seeding / cleanup on Node versions greater than 15
  if (Cypress.config().resolvedNodeVersion && parseInt(Cypress.config().resolvedNodeVersion) < 15) {
    cy.exec('cd .. && npm run seedDb');
  }
}

describe('End to end tests', () => {
  before(() => {
    seedDb();
  });
  it('search bar updates query string', () => {
    cy.visit('/');
    cy.get('.top-bar input').should('be.visible').type('John Doe');
    cy.location().should((loc) => {
      expect(loc.search).to.eq('?q=John+Doe');
    });
  });

  it('query string updates search bar', () => {
    cy.visit('?q=my+search+string');
    cy.get('.top-bar input').should('have.value', 'my search string');
  });

  it('has some user cards and a load more button', () => {
    cy.visit('/');
    cy.get('.user-card').should('have.length', 6);
    cy.get('.load-more').should('exist');
  });

  it('load more button loads more cards', () => {
    cy.visit('/');
    cy.get('.user-card').should('have.length', 6);
    cy.get('.load-more').click();
    cy.get('.user-card').should('have.length', 12);
    cy.location().should((loc) => {
      expect(loc.search).to.eq('?page=2');
    });
  });

  it('pagination works for filtered results', () => {
    cy.visit('/');
    cy.get('.top-bar input').type('d');
    cy.get('.user-card').should('have.length', 6);
    cy.get('.load-more').should('exist').click();
    cy.get('.user-card').should('have.length', 12);
  });

  it('can update a user', () => {
    cy.visit('/');
    cy.get('body').tab();
    cy.get('.top-bar input').tab();
    cy.get('.user-card:first').type('{enter}');
    cy.get('.edit-container').should('exist');
    cy.get(':nth-child(1) > input').should('have.focus');
    cy.get(':nth-child(1) > input').clear().type('_Jane Doe');
    cy.get(':nth-child(1) > input').tab();
    cy.get('.user-form > :nth-child(2) > input').should('have.focus');
    cy.get('.user-form > :nth-child(2) > input').clear().type('Reno');
    cy.get('.user-form > :nth-child(2) > input').tab();
    cy.get(':nth-child(3) > input').should('have.focus');
    cy.get(':nth-child(3) > input').clear().type('A description . . .');
    cy.get(':nth-child(3) > input').tab();
    cy.get('[type="submit"]').should('have.focus');
    cy.get('[type="submit"]').type('{enter}');
    cy.get('.user-card:first .name').should('have.text', '_Jane Doe');
    cy.get('.user-card:first .description').should('have.text', 'A description . . .');
  });

  after(() => {
    seedDb();
  });
});
