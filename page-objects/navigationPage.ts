import {Locator, Page} from '@playwright/test'
import { HelperBase } from './helperBase'

export class NavigationPage extends HelperBase{

    constructor(page: Page) {
        super(page)
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.selectMenuPage('Form Layouts')
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.selectMenuPage('Datepicker')
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.selectMenuPage('Smart Table')
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.selectMenuPage('Toastr')
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.selectMenuPage('Tooltip')
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false") {
            await groupMenuItem.click()
        } else {
            
        }
    }

        private async selectMenuPage(pageTitle: string) {
        const groupMenuItem = this.page.getByTitle(pageTitle)
        await this.page.getByText(pageTitle).click()
    }
}