/// <reference types="Cypress" />

describe('Test main menu', () => {
    // Example is taken from this test:
    // https://github.com/shopware/platform/blob/trunk/tests/e2e/cypress/integration/administration/catalogue/sw-product/visual.spec.js

    beforeEach(() => {
        // In our project, we use a global clean command:
        // https://github.com/shopware/e2e-testsuite-platform/blob/3.x/cypress/support/commands/system-commands.js#L26
        cy.loginViaApi()
            .then(() => {
                cy.openInitialPage(`/admin`);
            });
    });

    it('should open module through menu (general)', () => {
        cy.get('.sw-admin-menu')
            .should('be.visible')
            .then(() => {
                cy.get('.sw-admin-menu__item--sw-catalogue').click();
                cy.get('.sw-admin-menu__item--sw-catalogue .router-link-active').should('be.visible');
                cy.get(`.sw-admin-menu__item--sw-catalogue .sw-admin-menu__navigation-list-item.sw-product`)
                    .should('be.visible');
                cy.get(`.sw-admin-menu__item--sw-catalogue .sw-admin-menu__navigation-list-item.sw-product`)
                    .click();
            });
        cy.url().should('include', '#/sw/product/index');
    });

    it.skip('should open module through menu (current workaround)', () => {
        // Full command: https://github.com/shopware/e2e-testsuite-platform/blob/3.x/cypress/support/commands/commands.js#L989
        cy.clickMainMenuItem({
            targetPath: '#/sw/product/index',
            mainMenuId: 'sw-catalogue',
            subMenuId: 'sw-product'
        });
    });

    it.skip('should open module through menu (discarded workaround)', () => {
        cy.get('.sw-admin-menu')
            .should('be.visible')
            .then(() => {
                cy.get('.sw-admin-menu__item--sw-catalogue').click();
                cy.get('.sw-admin-menu__item--sw-catalogue .router-link-active').should('be.visible');
                cy.get(`.sw-admin-menu__item--sw-catalogue .sw-admin-menu__navigation-list-item.sw-product`)
                    .should('be.visible');

                // Full command: https://github.com/shopware/e2e-testsuite-platform/blob/3.x/cypress/support/commands/commands.js#L989
                cy.getAttached(`.sw-admin-menu__item--sw-catalogue .sw-admin-menu__navigation-list-item.sw-product`)
                    .click();
            });
        cy.url().should('include', '#/sw/product/index');
    });
});