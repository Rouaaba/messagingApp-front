describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('should register a new user as a normal user', () => {
    // Ensure the form is visible
    cy.get('form').should('be.visible');

    // Fill out the registration form
    cy.get('#username').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');

    // Open the role select dropdown and choose 'User'
    cy.get('#role').click();
    cy.contains('li', 'User').click(); // Adjust selector if needed

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert successful redirection or form submission
    cy.url().should('include', '/login'); // Adjust based on your success URL
  });

  it('should register a new admin', () => {
    // Ensure the form is visible
    cy.get('form').should('be.visible');

    // Fill out the registration form
    cy.get('#username').type('adminuser');
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('adminpassword123');

    // Open the role select dropdown and choose 'Admin'
    cy.get('#role').click();
    cy.contains('li', 'Admin').click(); // Adjust selector if needed

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert successful redirection or form submission
    cy.url().should('include', '/login'); // Adjust based on your success URL
  });
});
