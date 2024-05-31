const Instagram = require('./controllers/instagram');

require('dotenv').config();

async function main() {
  
  let client = new Instagram({headless: false})
  await client.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD)

  

}


main()