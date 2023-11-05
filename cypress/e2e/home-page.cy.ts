describe('Test home page', () => {

    beforeEach(() => {
        cy.task('resetDB')
        cy.task('seedDB')
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('/')
    })

    it('should render home page data', () => {

        cy.get('h1').first().should('have.text', 'Welcome to Your powerful rich Campy Blog app')
        cy.get('h2').first().should('have.text', 'Why is Campy so special?')
        cy.get('h5').eq(1).should('have.text', 'Modern Design')

        cy.get('h5').eq(2).should('have.text', 'Productivity')
        cy.get('h5').eq(3).should('have.text', 'Graphic and Multimedia')
        cy.get('h5').eq(4).should('have.text', 'Web & resource accessibility')

        cy.get('a[role="link"]').first().should('contain', 'Get started').click()

        cy.contains('Log in to InstaCamp')
        cy.url().should('include', '/auth/login')

    })

})

