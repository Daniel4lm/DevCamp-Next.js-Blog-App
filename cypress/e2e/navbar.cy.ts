describe("Navbar", () => {
    it("when user is not loged in renders login and signup links", () => {
        cy.visit('/')
        cy.get('[data-test="logo"]').click()
        cy.location("pathname").should('eq', '/')

        cy.get('[data-test="login-link"]').click()
        cy.location("pathname").should('eq', '/auth/login')
        cy.location().go("back")

        cy.get('[data-test="register-link"]').click()
        cy.location("pathname").should('eq', '/auth/register')
        cy.location().go("back")

        cy.get('html').should('have.class', 'dark')
        cy.get('[data-test="theme-toggle"]').should('be.visible').click();
        //cy.get('[data-test="theme-toggle"]').click()
        cy.get('html').should('not.have.class', 'dark')
    })
})
