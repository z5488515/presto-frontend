/* global cy, describe, it */

describe('Happy Path', () => {
  const email = `test${Date.now()}@test.com`;
  const password = 'password123';
  const name = 'Test User';
  const presentationName = 'My Presentation';
  const updatedName = 'Updated Presentation';

  it('completes the full happy path', () => {
    // 1. Register successfully
    cy.visit('/register');
    cy.get('input[placeholder="Your name"]').type(name);
    cy.get('input[placeholder="you@example.com"]').type(email);
    cy.get('input[placeholder="••••••••"]').first().type(password);
    cy.get('input[placeholder="••••••••"]').last().type(password);
    cy.contains('button', 'Create account').click();
    cy.wait(2000);
    cy.url().should('include', '/dashboard');

    // 2. Create a new presentation successfully
    cy.contains('button', '+ New Presentation').click();
    cy.wait(1000);
    cy.get('input[placeholder="My presentation"]').type(presentationName);
    cy.contains('button', 'Create').click();
    cy.wait(2000);
    // Wait for modal to fully close before proceeding
    cy.get('input[placeholder="My presentation"]').should('not.exist');
    cy.contains(presentationName).should('exist');

    // 3. Update the name of the presentation successfully
    cy.contains(presentationName).click();
    cy.wait(2000);
    cy.url().should('include', '/presentation');
    cy.contains('button', 'Edit').click();
    cy.wait(1000);
    cy.get('input[placeholder="Enter title"]').clear().type(updatedName);
    cy.contains('button', 'Save').click();
    cy.wait(1000);
    // Wait for edit modal to close
    cy.contains('button', 'Save').should('not.exist');
    cy.contains(updatedName).should('exist');

    // 4. Add some slides successfully
    cy.contains('button', '+ Add Slide').click();
    cy.wait(1000);
    cy.contains('button', '+ Add Slide').click();
    cy.wait(1000);

    // 5. Switch between slides successfully — use arrow key navigation
    cy.get('body').type('{rightarrow}');
    cy.wait(500);
    cy.get('body').type('{rightarrow}');
    cy.wait(500);
    cy.get('body').type('{leftarrow}');
    cy.wait(500);

    // 6. Delete the presentation successfully
    cy.contains('button', 'Delete Presentation').click();
    cy.wait(1000);
    cy.contains('button', 'Yes').click();
    cy.wait(2000);
    cy.url().should('include', '/dashboard');
    cy.contains(updatedName).should('not.exist');

    // 7. Logout successfully
    cy.contains('button', 'Logout').click();
    cy.wait(1000);
    cy.url().should('include', '/');

    // 8. Login again successfully
    cy.visit('/login');
    cy.get('input[placeholder="you@example.com"]').type(email);
    cy.get('input[placeholder="••••••••"]').type(password);
    cy.contains('button', 'Sign in').click();
    cy.wait(2000);
    cy.url().should('include', '/dashboard');
  });
});