/// <reference types="cypress" />

import { mount } from 'cypress/react';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// This is needed for typescript
Cypress.Commands.add('mount', mount);

// Cypress.Commands.add("nextAuthLogin", (userObj: any) => {

//     Cypress.log({
//         name: 'loginViaNextAuth.js',
//     });

//     cy.clearCookies()
//    cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

//     cy.wrap(null)
//         .then(() => {
//             return encode({
//                 token: userObj,
//                 secret: Cypress.env("NEXTAUTH_SECRET"),
//             });
//         })
//         .then((encryptedToken) =>
//             cy.setCookie("next-auth.session-token", encryptedToken)
//         );
// })

// function loginForm(username: string, password: string) {
//     // cy.visit('/').contains('Login').click()
//     // cy.get('input[name=username]').type(username, { delay: 100 }).should('have.value', 'daniel4mx')
//     // cy.get('input[name=password]').type(password, { delay: 100 }).should('have.value', '4444333')
//     // //cy.get('input[name=password]').type(`${password}{enter}`)
//     // cy.get('button[type=submit]').should('contain', 'Login').should('not.be.hidden').click()
//     // cy.url().should('equal', 'http://localhost:3000/')
//     // cy.getCookie('next-auth.session-token').should('exist')
// }

Cypress.Commands.add('login', (username: string, password: string) => {

    //cy.clearCookies()

    cy.session(
        [username, password],
        () => {
            cy.visit('/').contains('Login').click()
            cy.get('input[name=username]').type(username, { delay: 100 }).should('have.value', username)
            cy.get('input[name=password]').type(password, { delay: 100 }).should('have.value', password)
            //cy.get('input[name=password]').type(`${password}{enter}`) // if user press enter
            cy.get('button[type=submit]').should('contain', 'Login').should('not.be.hidden').click()

            cy.url().should('equal', 'http://localhost:3000/')
        },
        {
            validate: () => {
                cy.getCookie('next-auth.session-token').should('exist')
            },
            cacheAcrossSpecs: true
        }
    )
});

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
            //nextAuthLogin(userObj: User): Chainable<void>
            login(username: string, password: string): Chainable<void>
        }
    }
}