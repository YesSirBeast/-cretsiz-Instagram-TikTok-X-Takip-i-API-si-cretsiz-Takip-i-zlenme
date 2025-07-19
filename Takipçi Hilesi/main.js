const axios = require('axios');
const inquirer = require('inquirer');

const API_BASE_URL = 'https://testroichueserverpriv.roicmedya.com/';
const API_KEY = '595aac92490bbc94911acx00000000';

class SocialMediaAPI {
  constructor(apiKey, baseUrl = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async placeOrder(url, amount, platform) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/order`, {
        apiKey: this.apiKey,
        postUrl: url,
        amount: amount,
        platform: platform
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.data.error}`);
      }
      throw new Error(`Connection Error: ${error.message}`);
    }
  }
}

async function main() {
  const api = new SocialMediaAPI(API_KEY);

  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Hangi platform için işlem yapmak istersiniz?',
      choices: ['Instagram', 'TikTok', 'Twitter'],
    },
  ]);

  let orderDetails = {};

  switch (platform) {
    case 'Instagram':
      const { instagramAction } = await inquirer.prompt([
        {
          type: 'list',
          name: 'instagramAction',
          message: 'Instagram için hangi işlemi yapmak istersiniz?',
          choices: ['Takipçi Artırma', 'Reels İzlenme', 'Video Beğenisi'],
        },
      ]);

      if (instagramAction === 'Takipçi Artırma') {
        orderDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'url',
            message: 'Instagram profil URL\'nizi girin:',
          },
          {
            type: 'input',
            name: 'amount',
            message: 'Takipçi miktarını girin:',
            validate: (value) => !isNaN(value) && parseInt(value) > 0 ? true : 'Lütfen geçerli bir sayı girin.',
          },
        ]);
        orderDetails.platform = 'instagram_followers';
      } else if (instagramAction === 'Reels İzlenme') {
        orderDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'url',
            message: 'Reels video URL\'nizi girin:',
          },
          {
            type: 'input',
            name: 'amount',
            message: 'İzlenme miktarını girin:',
            validate: (value) => !isNaN(value) && parseInt(value) > 0 ? true : 'Lütfen geçerli bir sayı girin.',
          },
        ]);
        orderDetails.platform = 'instagram_views';
      } else { // Video Beğenisi
        orderDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'url',
            message: 'Instagram video URL\'nizi girin:',
          },
          {
            type: 'input',
            name: 'amount',
            message: 'Beğeni miktarını girin:',
            validate: (value) => !isNaN(value) && parseInt(value) > 0 ? true : 'Lütfen geçerli bir sayı girin.',
          },
        ]);
        orderDetails.platform = 'instagram_like';
      }
      break;

    case 'TikTok':
      orderDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'TikTok profil URL\'nizi girin:',
        },
        {
          type: 'input',
          name: 'amount',
          message: 'Takipçi miktarını girin:',
          validate: (value) => !isNaN(value) && parseInt(value) > 0 ? true : 'Lütfen geçerli bir sayı girin.',
        },
      ]);
      orderDetails.platform = 'tiktok_followers';
      break;

    case 'Twitter':
      orderDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Twitter gönderi URL\'nizi girin:',
        },
        {
          type: 'input',
          name: 'amount',
          message: 'Görüntüleme miktarını girin:',
          validate: (value) => !isNaN(value) && parseInt(value) > 0 ? true : 'Lütfen geçerli bir sayı girin.',
        },
      ]);
      orderDetails.platform = 'twitter_views';
      break;
  }

  try {
    console.log(`🚀 Placing ${orderDetails.platform.replace('_', ' ')} order...`);

    const order = await api.placeOrder(
      orderDetails.url,
      parseInt(orderDetails.amount),
      orderDetails.platform
    );

    console.log('✅ API Response:', JSON.stringify(order, null, 2));

    if (order.success) {
      console.log(`✅ ${order.message}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = SocialMediaAPI;
