function generatePrompt(data, lang = 'id') {
  let pendampingText = ''
  if (data.pendamping && data.pendamping.length > 0) {
    pendampingText = '\nKarakter Pendamping:' + data.pendamping.map((p, i) =>
      `\n  - Deskripsi: ${p.deskripsi}\n    Aksi: ${p.aksi}\n    Ekspresi: ${p.ekspresi}\n    Dialog: ${p.dialog}`
    ).join('')
  }
  let customText = ''
  if (data.customFields && data.customFields.length > 0) {
    customText = '\n' + data.customFields.map(f => `${f.title}: ${f.value}`).join('\n')
  }
  return `Judul Adegan: ${data.judul}\nDeskripsi Karakter Utama: ${data.deskripsi}\nDetail Suara Karakter: ${data.suara}\nAksi Karakter: ${data.aksi}\nEkspresi Karakter: ${data.ekspresi}\nLatar Tempat & Waktu: ${data.latar}\nDetail Visual Tambahan: ${data.visual}\nGerakan Kamera: ${data.cameraMotion}\nSuasana Keseluruhan: ${data.suasana}\nSuara Lingkungan/Ambience: ${data.ambience}${pendampingText}\nDialog Karakter: ${data.dialog}\nNegative Prompt: ${data.negative}${customText}`
}

function translatePrompt(data, idPrompt) {
  let pendampingText = ''
  if (data.pendamping && data.pendamping.length > 0) {
    pendampingText = '\nSupporting Characters:' + data.pendamping.map((p, i) =>
      `\n  - Description: ${translate(p.deskripsi)}\n    Action: ${translate(p.aksi)}\n    Expression: ${translate(p.ekspresi)}\n    Dialog (in Bahasa Indonesia): ${p.dialog}`
    ).join('')
  }
  let customText = ''
  if (data.customFields && data.customFields.length > 0) {
    customText = '\n' + data.customFields.map(f => `${translate(f.title)}: ${translate(f.value)}`).join('\n')
  }
  return `Scene Title: ${translate(data.judul)}\nMain Character Description: ${translate(data.deskripsi)}\nCharacter Voice Details: ${translate(data.suara)}\nCharacter Action: ${translate(data.aksi)}\nCharacter Expression: ${translate(data.ekspresi)}\nSetting (Place & Time): ${translate(data.latar)}\nAdditional Visual Details: ${translate(data.visual)}\nCamera Motion: ${data.cameraMotion}\nOverall Atmosphere: ${translate(data.suasana)}\nAmbience: ${translate(data.ambience)}${pendampingText}\nCharacter Dialog (in Bahasa Indonesia): ${data.dialog}\nNegative Prompt: ${translate(data.negative)}${customText}`
}

function translate(text) {
  // Dummy translate, bisa diganti dengan API
  if (!text) return ''
  return text
    .replace(/terminal bus malam/gi, 'night bus terminal')
    .replace(/Seorang vlogger wanita muda/gi, 'A young female vlogger')
    .replace(/warna kulit/gi, 'skin color')
    .replace(/Rambut/gi, 'Hair')
    .replace(/Wajah/gi, 'Face')
    .replace(/Pakaian/gi, 'Clothing')
    .replace(/malam hari/gi, 'at night')
    .replace(/hujan rintik-rintik/gi, 'drizzling rain')
    .replace(/pedagang kaki lima/gi, 'street vendors')
    .replace(/Resolusi 4K/gi, '4K resolution')
    .replace(/Suasana sibuk/gi, 'Busy atmosphere')
    .replace(/ramai/gi, 'crowded')
    .replace(/perjalanan malam/gi, 'night journey')
    .replace(/hidup dan dinamis/gi, 'lively and dynamic')
    .replace(/suara mesin bus menyala/gi, 'sound of bus engines running')
    .replace(/pengumuman dari pengeras suara/gi, 'announcements from loudspeakers')
    .replace(/derai hujan ringan/gi, 'light rain sounds')
    .replace(/percakapan samar/gi, 'faint conversations')
    .replace(/Hindari/gi, 'Avoid')
    .replace(/teks di layar/gi, 'on-screen text')
    .replace(/subtitle/gi, 'subtitles')
    .replace(/tulisan di video/gi, 'text in video')
    .replace(/font/gi, 'font')
    .replace(/logo/gi, 'logo')
    .replace(/distorsi/gi, 'distortion')
    .replace(/artefak/gi, 'artifact')
    .replace(/anomali/gi, 'anomaly')
    .replace(/wajah ganda/gi, 'double face')
    .replace(/anggota badan cacat/gi, 'deformed limbs')
    .replace(/tangan tidak normal/gi, 'abnormal hands')
    .replace(/orang tambahan/gi, 'extra people')
    .replace(/objek mengganggu/gi, 'distracting objects')
    .replace(/kualitas rendah/gi, 'low quality')
    .replace(/buram/gi, 'blurry')
    .replace(/glitch/gi, 'glitch')
    .replace(/suara robotik/gi, 'robotic voice')
    .replace(/suara pecah/gi, 'cracked voice')
    .replace(/dan/gi, 'and')
    .replace(/dengan/gi, 'with')
    .replace(/karakter/gi, 'character')
    .replace(/kamera/gi, 'camera')
    .replace(/gerakan/gi, 'motion')
    .replace(/ekspresi/gi, 'expression')
    .replace(/aksi/gi, 'action')
    .replace(/latar/gi, 'setting')
    .replace(/tempat/gi, 'place')
    .replace(/waktu/gi, 'time')
    .replace(/visual/gi, 'visual')
    .replace(/suasana/gi, 'atmosphere')
    .replace(/suara/gi, 'sound')
    .replace(/dialog/gi, 'dialog')
    .replace(/prompt/gi, 'prompt')
    .replace(/utama/gi, 'main')
    .replace(/tambahan/gi, 'additional')
    .replace(/keseluruhan/gi, 'overall')
    .replace(/lingkungan/gi, 'environment')
    .replace(/bahasa indonesia/gi, 'Bahasa Indonesia')
}

export { generatePrompt, translatePrompt } 