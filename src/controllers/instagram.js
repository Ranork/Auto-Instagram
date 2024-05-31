const { default: puppeteer } = require("puppeteer")



class Instagram {
  
  /** Instagram Client
   * @param {PuppeteerLaunchOptions} browserSettings - Puppeteer browser settings
   * 
   * @param {Object} instagramSettings - Settings for linkedin static variables
   */
  constructor(browserSettings, instagramSettings) {
    this.browserSettings = browserSettings
    this.instagramSettings = instagramSettings || {}
  }


  
  /** Get client's browser
   * @returns Browser - puppeteer browser
   */
  async getBrowser() {
    if (this.browser) { return this.browser }

    this.browser = await puppeteer.launch(this.browserSettings)
    console.log('  New Browser created.')
    return this.browser
  }


  async login(username, password) {
    console.log('[TASK] Login');

    const browser = await this.getBrowser()
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com');
  
    await new Promise(r => setTimeout(r, 2000));

    let loginForm
    try {
      loginForm = await page.evaluate(() => {
        return document.querySelector('#loginForm').innerHTML
      })
    }
    catch (e) { console.log(e); }

    if (!loginForm) {
      console.log('  Login form not found');
    }

    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);

    await page.click('#loginForm button[type="submit"]');

    await page.waitForNavigation()

    let waitedForSaveInfo = await page.evaluate(() => {
      for (let btn of document.querySelectorAll('button')) {
        if (btn.innerText.trim() === 'Save info') {
          btn.click()
          return true
        }
        else return false
      }
    })
    if (waitedForSaveInfo) await page.waitForNavigation()


    await page.evaluate(() => {
      for (let btn of document.querySelectorAll('button')) {
        if (btn.innerText.trim() === 'Not Now') btn.click()
      }
    })

    await new Promise(r => setTimeout(r, 500));

    let likeButton
    try {
      likeButton = await page.evaluate(() => {
        return document.querySelector('svg[aria-label="Like"]').innerHTML
      })
    }
    catch (e) { console.log('  Error (likeButton): ' + e.message); }

    if (likeButton) console.log('  Login completed.');
  }

}


module.exports = Instagram