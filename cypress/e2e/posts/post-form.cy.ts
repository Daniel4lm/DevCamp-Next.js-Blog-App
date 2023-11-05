describe('login test', () => {

    beforeEach(() => {
        cy.task('resetDB')
        cy.task('seedDB')
        cy.viewport(1280, 720)
        cy.login('daniel4mx', '4444333')
    })

    const createSlug = (title: string) => {
        return title.toLowerCase()
            .trim()
            .replaceAll(/[^a-zA-Z0-9&]/g, ' ')
            .replaceAll("&", "and")
            .replaceAll(/(\s{1,})/g, " ")
            .split(' ')
            .join('-')
    }

    it('users cannot submit new post', { defaultCommandTimeout: 90000 }, () => {

        cy.visit('/posts/new')
        cy.contains('New blog post').should('be.visible')

        cy.get('#editor-container #body_ifr').should('exist').should('be.visible');
        cy.get("#upload-image").should('contain', "Your file must be in JPG or PNG format");

        cy.get('input[name=title]').type('...', { delay: 100 }).clear().blur()
        cy.get('#title-warn').should('be.visible').and('contain', "Title can't be blank!")

        cy.get('input[name=tags]')
            .type('react{enter}', { delay: 100 })
            .type('react{enter}', { delay: 100 })
            .type('next.js{enter}', { delay: 100 })
            .type('dev,', { delay: 100 })

        //cy.scrollTo(0, 500)
        cy.window().scrollTo('bottom', { duration: 500 })

        cy.get("#body_ifr")
            .then(function ($iframe) {
                const $body = $iframe.contents().find("body");

                cy.wrap($body[0]).type("HTML", { timeout: 100 }).should('contain.text', 'HTML').clear().blur();

                cy.get('input[name=title]').clear().type('Short...', { delay: 100 }).blur()

                cy.get('#body-warn').should('be.visible').and('contain', "Content can't be blank!")

                cy.get('button[type=submit]').should('contain', 'Submit').should("be.disabled")

                cy.wrap($body[0])
                    .type("Short text", { timeout: 100 }).should('contain.text', 'Short text')
            });

        cy.get('#title-warn').should('be.visible').and('contain', "Title must be 10 or more characters long!")
        cy.get('#body-warn').should('be.visible').and('contain', "Content too short!")

        cy.get('#post-page').scrollTo('top', { ensureScrollable: false })

        cy.get('#post-upload-image').selectFile('cypress/fixtures/example.json', { force: true, action: 'select' })
        cy.get(".alert-danger").should('be.visible').should('contain', "Only .png, .jpg and .jpeg format allowed!");
        cy.get('#remove-message', { timeout: 2000 }).should('be.visible').click()

        cy.get('button[type=submit]').should('contain', 'Submit').should("be.disabled")
    });

    it('users can create new post', { defaultCommandTimeout: 90000 }, () => {

        cy.visit('/posts/new')
        cy.contains('New blog post').should('be.visible')
        cy.get('#editor-container #body_ifr').should('exist').should('be.visible');

        cy.get('input[name=title]').type('Next.js article', { delay: 100 }).should('have.value', 'Next.js article').blur()

        let title: string

        cy.get('input[name=title]')
            .invoke('val')
            .then(text => {
                title = text as string;
            });

        cy.get('input[name=tags]')
            .type('react{enter}', { delay: 100 })
            .type('react{enter}', { delay: 100 })
            .type('next.js{enter}', { delay: 100 })
            .type('dev,', { delay: 100 })

        let postTopics: string[] = []
        cy.get('[data-test="post-topic-item"]').should('have.length', 3).each(($li) => postTopics.push($li.text()))

        let bodyText: string

        cy.get("#body_ifr")
            .then(function ($iframe) {
                const $body = $iframe.contents().find("body");

                cy.wrap($body[0])
                    .type("Some interesting content here...", { timeout: 100 }).should('contain.text', 'Some interesting content here...')

                // cy.get('#show-more', { timeout: 2000 }).trigger('mouseover').click()
                // cy.contains("Show less")
                // cy.get('a', { timeout: 2000 }).should('contain', 'Show less').click()
                // cy.contains("Show more")
                // cy.get('#word-count').should('have.text', '4 words')
            });

        cy.get('#title-warn').should('not.exist')
        cy.get('#body-warn').should('not.exist')

        cy.get("#body_ifr")
            .then(function ($iframe) {
                const $body = $iframe.contents().find("body");
                bodyText = ($body[0] as HTMLBodyElement).innerText || ''
            })

        //cy.get(".tox-tinymce")
        //    .trigger('mouseover')
        //    .contains("Show more")
        //    .get('#word-count').should('have.text', '4 words')

        cy.get('#post-upload-image').selectFile('cypress/fixtures/test_image.jpg', { force: true, action: 'select' })

        cy.contains('Image selected:').should('exist')
        cy.contains('test_image.jpg').should('exist')
        cy.get('[alt="Blog Upload Photo"]', { timeout: 1000 }).should('exist');
        cy.get('#cancel-image-upload', { timeout: 2000 }).should('be.visible').click()

        cy.contains('test_image.jpg').should('not.exist')
        cy.get('[alt="Blog Upload Photo"]', { timeout: 1000 }).should('not.exist');

        cy.get('button[type=submit]').should('contain', 'Submit').should("be.enabled")

        cy.fixture('test_image.jpg', 'binary').then(image => {
            const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
            const formData = new FormData();

            if (image) formData.append('photoUrl', blob, 'test_image.jpg')
            formData.append('title', title)
            formData.append('body', bodyText)
            formData.append('tags', (postTopics || '').toString())
            formData.append('published', 'publish')
            formData.append('readTime', '1')
            formData.append('slug', createSlug(title))
            formData.append('userEmail', 'daniel@gmail.com')

            console.log(JSON.stringify(Object.fromEntries(formData.entries())))

            cy.request({
                method: 'POST',
                url: `/api/posts`,
                body: formData,
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })
        })

    });

});
