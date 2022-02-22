/// <reference types="Cypress" />
import ProductPageObject from '../support/pages/sw-product.page-object';

describe('Test main menu', () => {
    // Example is taken from this test:
    // https://github.com/shopware/platform/blob/trunk/tests/e2e/cypress/integration/administration/catalogue/sw-product/visual.spec.js

    beforeEach(() => {
        // In our project, we use a global clean command:
        // https://github.com/shopware/e2e-testsuite-platform/blob/3.x/cypress/support/commands/system-commands.js#L26
        cy.loginViaApi()
            .then(() => {
                return cy.createPropertyFixture({
                    options: [{ name: 'Red' }, { name: 'Yellow' }, { name: 'Green' }]
                });
            })
            .then(() => {
                return cy.createPropertyFixture({
                    name: 'Size',
                    options: [{ name: 'S' }, { name: 'M' }, { name: 'L' }]
                });
            })
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                cy.openInitialPage('/admin#/sw/product/index');
            });
    });

    it('should open product variant', () => {
        const page = new ProductPageObject();

        // Request we want to wait for later
        cy.intercept({
            url: `${Cypress.env('apiPath')}/_action/sync`,
            method: 'POST'
        }).as('saveData');

        // Navigate to variant generator listing and start
        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );

        cy.get('.sw-product-detail__tab-variants').click();
        cy.get(page.elements.loader).should('not.exist');
        cy.get(`.sw-product-detail-variants__generated-variants-empty-state ${page.elements.ghostButton}`)
            .should('be.visible')
            .click();
        cy.get('.sw-product-modal-variant-generation').should('be.visible');

        // Create and verify one-dimensional variant
        page.generateVariants('Color', [0, 1, 2], 3);
        cy.get('.sw-product-variants-overview').should('be.visible');

        // Open product variant
        cy.get('.sw-product-variants-overview').should('be.visible');
        cy.get('.sw-skeleton.sw-skeleton__detail').should('not.exist');
        cy.get('.sw-skeleton.sw-skeleton__listing').should('not.exist');
        cy.get('.sw-data-grid__row--1 a').should('exist');
        cy.get('.sw-data-grid__row--1 a').contains('Red');

        /*
        ...Quote: The following click is detached. I examined this a bit. The problem is that if you want to
        click on the item a hover state will be triggered in Vue. This rerenders the component and then the
        element is detached from the DOM. Example:
            Render
            Cypress hover
            Rerender (because Hover Icon will be rendered)
            Cypress click (Detached DOM, because element was rerendered)
         */
        cy.get('.sw-data-grid__row--1 a').click();

        cy.get('.product-basic-form .sw-inheritance-switch').eq(0).click();
        cy.get('input[name=sw-field--product-name]').should('be.visible');
    });

    afterEach(() => {
        // Workaround, in our project it's handles by a mysqldump in beforeEach hook
        cy.deleteViaAdminApi('product', 'Product name');
    })
});