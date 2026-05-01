import { keyframes } from '@angular/animations'
import {expect, test} from '@playwright/test'
import { filter } from 'rxjs-compat/operator/filter'
import { timeout } from 'rxjs-compat/operator/timeout'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    }) 

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card',{hasText: "Using the Grid"}).getByRole('textbox', {name: "email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500})

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card',{hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force: true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()

        //locator assertion
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 2"})).toBeChecked()
    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    const toastrConfiguration = page.locator('nb-card',{hasText: "Toaster configuration"})


    await toastrConfiguration.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    expect(await toastrConfiguration.getByRole('checkbox', {name: "Hide on click"}).isChecked()).toBeFalsy()

    await toastrConfiguration.getByRole('checkbox', {name: "Hide on click"}).check({force: true})
    expect(await toastrConfiguration.getByRole('checkbox', {name: "Hide on click"}).isChecked())

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }
})

test('dropdowns', async({page}) => {

   const dropdownMenu = await page.locator('ngx-header nb-select')
   await dropdownMenu.click()

   //page.getByRole('list') // when the list has a UL tag
   //page.getByRole('listitem') //when the list has LI tag

    const optionsList = page.locator('nb-option-list nb-option')
   //await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
   const header = page.locator('nb-layout-header')
   /*await optionsList.filter({hasText: "Dark"}).click()
   await expect(header).toHaveCSS('background-color','rgb(34, 43, 69)')*/

   const colors = {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)"
    }

    for(const color in colors){
        await optionsList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
        await dropdownMenu.click()
    }
})

test('tooltips', async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
        await toolTipCard.getByRole('button', {name: "TOP"}).hover()

        const toolTip = await page.locator('nb-tooltip').textContent()
        expect(toolTip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
        await expect(page.locator('table tbody tr').first()).not.toContainText('mdo@gmail.com')

})

test('web tables', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        //1 get the row by any test in this row
        const targetRow = await page.getByRole('row', {name: "twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()
        const inputAge = await page.locator('input-editor').getByPlaceholder('age')
        await inputAge.clear()
        await inputAge.fill('97')
        await page.locator('.nb-checkmark').click()
        

        //get the row based on the specific column
        await page.locator('.ng2-smart-page-item', {hasText: "2"}).click()
        const newTargetRow = await page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
        await newTargetRow.locator('.nb-edit').click()
        const inputEmail= await page.locator('input-editor').getByPlaceholder('E-mail')
        await inputEmail.clear()
        await inputEmail.fill('1234@gmail.com')
        await page.locator('.nb-checkmark').click()
        expect(newTargetRow).toContainText('1234@gmail.com')
        expect(newTargetRow.locator('td').nth(5)).toHaveText('1234@gmail.com')

        //3 Test filter on the table
        const ages = ["20", "30", "40", "200"]
        const filterInputAge = await page.locator('input-filter').getByPlaceholder('Age')

        for (let age of ages) {
            await filterInputAge.clear()
            await filterInputAge.fill(age)
            await page.waitForTimeout(500)
            const ageRows = page.locator('tbody tr')

            for(let row of await ageRows.all()) {
                const cellValue = await row.locator('td').last().textContent()

                if(age == "200"){
                    expect(cellValue).toContain('No data found')

                } else {
                    expect(cellValue).toEqual(age)
                }

            }
           
        }
})

test('datepicker', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        
        let date = new Date()
        date.setDate(date.getDate() + 14)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: "short"})
        const expectedMonthLong = date.toLocaleString('En-US', {month: "long"})
        const expectedMYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedMYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedMYear} `

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
        await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    //update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    //mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    
    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})