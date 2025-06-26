const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeRestaurants() {
const browser = await puppeteer.launch({ 
  headless: "new",
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
  const page = await browser.newPage();
  
  // Array to store all restaurants
  let restaurants = [];
  let pageNum = 1;
  
  try {
    // Go to Foodpanda Lahore page
    await page.goto('https://www.foodpanda.pk/restaurants/city/lahore');
    await page.waitForSelector('.vendor-list-item');

    while (true) {
      console.log(`Scraping page ${pageNum}...`);

      // Get all restaurants on current page
      const pageRestaurants = await page.evaluate(() => {
        const items = document.querySelectorAll('.vendor-list-item');
        return Array.from(items).map(item => {
          const name = item.querySelector('.vendor-info h2')?.textContent?.trim() || '';
          const imageUrl = item.querySelector('.vendor-picture img')?.src || '';
          const rating = item.querySelector('.rating-value')?.textContent?.trim() || '';
          const cuisine = item.querySelector('.vendor-info .vendor-categories')?.textContent?.trim() || '';
          const deliveryTime = item.querySelector('.delivery-time')?.textContent?.trim() || '';
          const minOrder = item.querySelector('.minimum-order')?.textContent?.trim() || '';
          
          return {
            name,
            imageUrl,
            rating: parseFloat(rating) || 0,
            cuisine,
            deliveryTime,
            minOrder,
            location: 'Lahore'
          };
        });
      });

      restaurants = [...restaurants, ...pageRestaurants];
      console.log(`Found ${pageRestaurants.length} restaurants on page ${pageNum}`);

      // Check if next page exists
      const hasNextPage = await page.evaluate(() => {
        const nextButton = document.querySelector('.next-page:not(.disabled)');
        return !!nextButton;
      });

      if (!hasNextPage || pageNum >= 50) break; // Limit to 50 pages or when no more pages

      // Click next page
      await Promise.all([
        page.waitForNavigation(),
        page.click('.next-page')
      ]);

      pageNum++;
    }

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }

  // Save to file
  fs.writeFileSync(
    'src/data/restaurants.json',
    JSON.stringify(restaurants, null, 2)
  );

  console.log(`Scraping complete. Found ${restaurants.length} restaurants.`);
}

scrapeRestaurants();
