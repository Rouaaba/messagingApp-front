describe('User Login', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
  
    it('should log in as a normal user and redirect to User Dashboard', () => {
      cy.get("#username").type('newuser');
      cy.get("#password").type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', 'http://localhost:3000/user/dashboard');
    });
  
    it('should log in as an admin and redirect to Admin Dashboard', () => {
      cy.get("#username").type('adminuser');
      cy.get("#password").type('adminpassword123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', 'http://localhost:3000/admin/dashboard');
    });
  
    it('should show an error for invalid login credentials', () => {
        cy.visit('http://localhost:3000/login');
        
        // Type invalid credentials into the login form
        cy.get('#username').type('invalidUser');
        cy.get('#password').type('invalidPass');
        
        // Submit the form
        cy.get('button[type="submit"]').click();
        
        // Check for the error message
        cy.get('.error-message')
          .should('be.visible')
          .and('contain.text', 'Login failed');
      });      
  });
  