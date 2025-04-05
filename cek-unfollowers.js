const fs = require('fs');
const JSZip = require('jszip');

// Nama file ZIP (harus 1 folder sama script ini)
const zipPath = './instagram-ryannnhz_-2025-03-31-SD9pi8wb.zip';

fs.readFile(zipPath, async (err, data) => {
  if (err) return console.error('GAGAL BACA FILE:', err);

  try {
    const zip = await JSZip.loadAsync(data);
    let following = [];
    let followers = [];

    for (const filename of Object.keys(zip.files)) {
      const file = zip.files[filename];

      if (filename.includes('following.json')) {
        const content = await file.async('string');
        const parsed = JSON.parse(content);
        following = parsed.relationships_following.map(x => x.string_list_data[0].value);
      }

      if (filename.includes('followers_1.json')) {
        const content = await file.async('string');
        const parsed = JSON.parse(content);
        followers = parsed.map(x => x.string_list_data[0].value);
      }
    }

    if (!following.length || !followers.length) {
      console.log('DATA NYA KOSONG GOBLOK, COBA CEK FILE-NYA LAGI');
      return;
    }

    const unfollowers = following.filter(user => !followers.includes(user));

    console.log(`\nTotal following: ${following.length}`);
    console.log(`Total followers: ${followers.length}`);
    console.log(`Yang gak follow balik (${unfollowers.length} akun):\n`);

    unfollowers.forEach((u, i) => {
      console.log(`${i + 1}. ${u}`);
    });

  } catch (e) {
    console.error('ERROR PAS BACA ZIP:', e.message);
  }
});
