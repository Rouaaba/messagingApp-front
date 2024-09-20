describe('User Profile and Account Deletion', () => {
    before(() => {
      // This assumes the user has already been created in a previous test or manually
    });
  
    beforeEach(() => {
      // Log in before each test to ensure the user is authenticated
      cy.visit('http://localhost:3000/login');
      cy.get('#username').type('newuser'); // Replace with the actual username
      cy.get('#password').type('password123'); // Replace with the correct password
      cy.get('button[type="submit"]').click();
    });
  
    it('should display the user profile and then delete the account', () => {
      // Step 1: Navigate to the user dashboard
      cy.url().should('include', 'http://localhost:3000/user/dashboard'); // Ensure we are on the dashboard page
  
      // Step 2: Open the profile menu
      // Find the Avatar containing the AccountCircleIcon and click it
      cy.get('button').find('svg').should('have.attr', 'data-testid', 'AccountCircleIcon').click(); 
  
      // Step 3: Open the Profile menu item
      // Ensure the menu is visible before clicking on the "Profile" option
      cy.get('ul').contains('Profile').click(); 
  
      // Step 4: Verify user profile information is displayed
      cy.url().should('include', 'http://localhost:3000/user/profile'); // Ensure we are on the profile page
      cy.contains('User Information').should('be.visible');
      cy.get('body').should('contain', 'Username: newuser'); // Adjust based on the actual username
      cy.get('body').should('contain', 'Email:'); // Check for email if needed
  
      // Step 5: Open the Delete Account dialog
      cy.get('[data-testid="open-delete-dialog"]').click();
  
      // Step 6: Enter password for confirmation
      cy.get('input[type="password"]').type('password123'); // Replace with the correct password
  
      // Step 7: Confirm deletion (click the Delete button inside the dialog)
      cy.get('[data-testid="confirm-delete"]').click({ force: true });
  
      // Step 8: Confirm the browser dialog (for confirmation alert)
      cy.on('window:confirm', () => true); // Automatically confirm the alert dialog
  
      // Step 9: Ensure redirection to login page after deletion
      cy.url().should('include', 'http://localhost:3000/login');
  
      // Step 10: Ensure the user cannot log in again
      cy.get('#username').type('newuser');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('contain.text', 'Login failed'); // Adjust based on your app's error handling
    });
  });
  