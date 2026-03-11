module.exports = {
  konfirmasiPenerimaanNegara: [
    'Permohonan Konfirmasi Setoran Penerimaan Negara',
    'Nota Konfirmasi Penerimaan Negara'
  ],
  daftarRekaptulasi: [
    'NTPN',
    'NTPN BILLINGCODE NTPNRS',
    'Tanggal Penerimaan',
    'Bagan Akun Span'
  ],
  buktiSetorandanBilling: ['NPWP', 'Detail Billing', 'Kode Bliing'],
  adkKonfirmasi: {
    regex: '^[A-Z0-9]{16};[0-9]+;[0-9]+;[0-9]+;[0-9]+$',
    separator: ';'
  },
  tandaTangan: ['Kuasa Pengguna Anggaran', 'PP-SPM', 'PPSPM', 'NIP']
}
