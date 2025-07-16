import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchPIHPS() {
  try {
    const res = await axios.get('https://hargapangan.id/');
    const html = res.data;

    const $ = cheerio.load(html);
    const data = [];

    $('table.table-bordered tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      const komoditas = $(tds[0]).text().trim();
      const harga = $(tds[1]).text().trim();

      if (komoditas && harga) {
        data.push({ komoditas, harga });
      }
    });

    return data;
  } catch (err) {
    console.error('Gagal ambil data:', err.message);
    return [];
  }
}
