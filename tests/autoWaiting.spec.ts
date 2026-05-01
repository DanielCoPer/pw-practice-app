import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('autowaiting', async({page}) => {

    const successButton =  page.locator('.bg-success')

    await successButton.click()
    //const text = await successButton.textContent()

    //allTextContexts does not wait for element visibility
    await successButton.waitFor({state: "attached"})
    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) => {

    const successButton =  page.locator('.bg-success')


    //___ wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //___ wait for network calls to be completed ('NOT RECOMMENDED")
    //await page.waitForLoadState('networkidle')

    //hardcoded wait NOT recommended

    //await page.waitForTimeout(5000)

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

})


test('timeouts', async({page}) => {

    const successButton =  page.locator('.bg-success')
    await successButton.click()
})
