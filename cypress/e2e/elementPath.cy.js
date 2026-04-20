describe('Slide Element Path', () => {
  const email = `elem${Date.now()}@test.com`;
  const password = 'password123';
  const name = 'Element User';

  before(() => {
    // Register once
    cy.visit('/register');
    cy.get('input[placeholder="Your name"]').type(name);
    cy.get('input[placeholder="you@example.com"]').type(email);
    cy.get('input[placeholder="••••••••"]').first().type(password);
    cy.get('input[placeholder="••••••••"]').last().type(password);
    cy.contains('button', 'Create account').click();
    cy.wait(2000);
    cy.url().should('include', '/dashboard');
    // Save token to Cypress env so tests can restore it
    cy.window().then(win => {
      const token = win.localStorage.getItem('token');
      Cypress.env('authToken', token);
    });
  });

  const restoreSession = () => {
    // Restore token before each test since Cypress clears localStorage between tests
    cy.window().then(win => {
      const token = Cypress.env('authToken');
      if (token) win.localStorage.setItem('token', token);
    });
  };

  const createPresentation = () => {
    cy.visit('/dashboard');
    restoreSession();
    cy.wait(2000);
    cy.url().should('include', '/dashboard');

    // Dismiss any lingering modal
    cy.get('body').type('{esc}');
    cy.wait(500);

    cy.contains('button', '+ New Presentation').should('be.visible').click();
    cy.wait(1000);
    cy.contains('h2', 'New Presentation').should('be.visible');
    cy.get('input[placeholder="My presentation"]').should('be.visible').type('Element Test');
    cy.contains('button', 'Create').click();
    cy.wait(2000);
    cy.contains('h2', 'New Presentation').should('not.exist');
    cy.wait(500);
    cy.contains('Element Test').click();
    cy.wait(2000);
    cy.url().should('include', '/presentation');
  };

  const deletePresentation = () => {
    cy.get('body').type('{esc}');
    cy.wait(500);
    cy.contains('button', 'Delete Presentation').click({ force: true });
    cy.wait(1000);
    cy.contains('button', 'Yes').click({ force: true });
    cy.wait(2000);
    cy.url().should('include', '/dashboard');
  };

  it('adds a text element, edits it, then deletes it', () => {
    createPresentation();

    cy.contains('button', 'Text').click();
    cy.wait(1000);
    cy.contains('Add Text Block').should('be.visible');
    cy.get('textarea').first().clear().type('Hello World');
    cy.get('h2').contains('Add Text Block').parents('div').first()
      .find('button').contains('Add').click();
    cy.wait(2000);
    cy.contains('Add Text Block').should('not.exist');
    cy.contains('Hello World').should('exist');

    cy.contains('Hello World').dblclick();
    cy.wait(1000);
    cy.contains('Edit Text Block').should('be.visible');
    cy.get('textarea').first().clear().type('Updated Text');
    cy.get('h2').contains('Edit Text Block').parents('div').first()
      .find('button').contains('Save').click();
    cy.wait(2000);
    cy.contains('Edit Text Block').should('not.exist');
    cy.contains('Updated Text').should('exist');

    cy.contains('Updated Text').rightclick();
    cy.wait(1000);
    cy.contains('Updated Text').should('not.exist');

    deletePresentation();
  });

  it('adds an image element and verifies it renders', () => {
    createPresentation();

    cy.contains('button', 'Image').click();
    cy.wait(1000);
    cy.contains('Add Image').should('be.visible');
    cy.get('input[placeholder="https://example.com/image.jpg"]')
      .type('https://picsum.photos/200');
    cy.get('input[placeholder="Describe the image"]').type('Test image');
    cy.get('h2').contains('Add Image').parents('div').first()
      .find('button').contains('Add').click();
    cy.wait(2000);
    cy.contains('Add Image').should('not.exist');
    cy.get('img[alt="Test image"]').should('exist');

    deletePresentation();
  });

  it('sets a slide background colour and verifies modal closes', () => {
    createPresentation();

    cy.contains('button', 'Background').click();
    cy.wait(1000);
    cy.contains('Background Settings').should('be.visible');
    cy.get('select').first().select('solid');
    cy.wait(500);
    cy.get('h2').contains('Background Settings').parents('div').first()
      .find('button').contains('Save').click();
    cy.wait(2000);
    cy.contains('Background Settings').should('not.exist');

    deletePresentation();
  });

  it('opens preview mode', () => {
    createPresentation();

    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains('button', 'Preview').click();
    cy.wait(500);
    cy.get('@windowOpen').should('have.been.called');

    deletePresentation();
  });
});