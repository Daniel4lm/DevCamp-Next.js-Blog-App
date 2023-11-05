/* eslint-disable cypress/no-unnecessary-waiting */

describe('login test', () => {

    beforeEach(() => {
        cy.task('resetDB')
        cy.task('seedDB')
    })

    // const user = {
    //     id: "de444455555333221mx",
    //     email: "test@example.com",
    //     fullName: "Morty Smith",
    //     username: "test_user",
    //     avatarUrl: "/path/to/your/mock/user.jpg",
    //     themeMode: "LIGHT",
    //     fontName: "default",
    //     role: "USER"
    // };

    it("should redirect to sign in without a session cookie", () => {
        cy.visit('/posts/new');
        cy.get("h1").should("contain", "Log in to InstaCamp");

        cy.url().should("include", "/auth/login");
    });

    it('should not let the user to log into our app', () => {

        cy.visit('/auth/login')

        cy.get('input[name=username]').type('daniel4mx', { delay: 100 }).clear().blur()
        cy.get('.invalid-feedback').eq(0).should('be.visible').and('contain', "Username can't be blank!")

        cy.get('input[name=password]').type('4444333', { delay: 100 }).clear().blur()
        cy.get('.invalid-feedback').eq(1).should('be.visible').and('contain', "Password can't be blank!")

        cy.get('input[name=username]').type('dan', { delay: 100 }).blur()
        cy.get('.invalid-feedback').eq(0).should('be.visible').and('contain', "Username must be 4 or more characters long!")

        cy.get('input[name=password]').type('4444', { delay: 100 }).blur()
        cy.get('.invalid-feedback').eq(1).should('be.visible').and('contain', "Password must be 6 or more characters long!")

        cy.get('button[type=submit]').should('contain', 'Login').should("be.disabled")

    });

    it('should successfully log into our app', () => {

        cy.login('daniel4mx', '4444333')
        cy.visit('/')

        cy.get('h1').first().should('have.text', 'Welcome to Your powerful rich Campy Blog app')
        cy.get('a[role="link"]').first().should('contain', 'Visit Blog')//.click()

        cy.get('[data-test="theme-toggle"]').should('be.visible').trigger('mouseover');
        cy.get('.bottom-tooltip-text').should('be.visible').should('contain.text', 'Day/Night Theme');
        cy.get('[data-test="theme-toggle"]').trigger('mouseleave');

        cy.get('[data-test="work-menu-title"]').should('be.visible').click();
        cy.get('[data-test="work-menu-list"]')
            .should('be.visible')
            .within(() => {
                cy.get('#home-icon').should("contain", "Home")
                cy.get('#new-post').should("contain", "New post")
                cy.get('#mobile-menu-close').click();
            })

        cy.get('[data-test="user-avatar-link"]').should('be.visible').click();

        cy.get('[data-test="settings-menu-list"]').should('be.visible')
        cy.get('[data-test="user-name-title"]').should('contain', 'Daniel Molnar')
        cy.get('[data-test="user-email-title"]').should('contain', 'daniel@gmail.com')
        cy.get('[data-test="close-menu-link"]').should('be.visible')
        cy.get('[data-test="my-profile-link"]').should('be.visible').should('contain', 'My profile')//.click()
        cy.get('[data-test="saved-list-link"]').should('be.visible').should('contain', 'Saved list')//.click()
        cy.get('[data-test="settings-link"]').should('be.visible').should('contain', 'Settings')//.click()
        cy.get('[data-test="logout-link"]').should('be.visible').should('contain', 'Log Out')//.click()

        cy.get('[data-test="close-menu-link"]').click();

    })

})