async function main() {
  const res = await fetch('https://www.google.com/maps/place/Lasusua,+North+Kolaka+Regency,+Southeast+Sulawesi/@-3.4344682,120.8953158,14z', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });
  const html = await res.text();
  const match = html.match(/!1m18!1m12!1m3![^"'\s&]+/);
  console.log('Match:', match ? match[0] : 'None');
  
  // Also check alternative place patterns
  const placeMatch = html.match(/0x2d91[0-9a-fA-F]+:0x[0-9a-fA-F]+/);
  console.log('Place ID:', placeMatch ? placeMatch[0] : 'None');
}
main();
