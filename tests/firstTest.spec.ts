import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    //by tag name
    page.locator('input')

    //by id
    await page.locator('#inputEmail1').click()

    //by class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by entire class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different locators
    page.locator('input [placeholder="Email"][nbinput]')

    //by xpath
    page.locator('//*[@id="inputEmail1"]')

    //by partial text
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators',async ({page}) => {
    //by role
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign In"}).first().click()

    //by label
    await page.getByLabel('Email').first().click()

    //by placeholder
    await page.getByPlaceholder('Jane Doe').first().click()

    //by text
    await page.getByText('Using the Grid').click()

    //by title
    await page.getByTitle('IoT Dashboard').click()

    //by testid
    await page.getByTestId('SignIn').click()

})

test('locating child elements', async({page})=>{

    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    //avoid using this one
    await page.locator('nb-card').nth(3).getByRole('button').click()

})

test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name:'Email'}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name:'Email'}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name:'Email'}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name:'Password'}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name:'Email'}).click()

    //not really recommended
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name:'Email'}).click()

})

test('reusing locators', async({page}) => {
    
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailInput = basicForm.getByRole('textbox', {name:'Email'})
    const passwordInput = basicForm.getByRole('textbox', {name:'Password'})
    const signInButton = basicForm.getByRole('button')
    const email = 'test@test.com'
    const password = 'Welcome123'

    await emailInput.fill(email)
    await passwordInput.fill(password)
    await basicForm.locator('nb-checkbox').click()
    await signInButton.click()

    await expect(emailInput).toHaveValue('test@test.com')
    await expect(passwordInput).toHaveValue('Welcome123')

})

test('extracting values', async({page}) => {

    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonTest = await basicForm.locator('button').textContent()
    expect(buttonTest).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailInput = basicForm.getByRole('textbox', {name:'Email'})
    await emailInput.fill('test@test.com')
    const emailValue = await emailInput.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailInput.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

})

test('assertions', async({page}) => {

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    //General assertions
    const basicFormButtonText = await basicFormButton.textContent()

    expect(basicFormButtonText).toEqual('Submit')

    //locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})