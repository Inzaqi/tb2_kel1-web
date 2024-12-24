const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware untuk mengakses file statis (HTML, CSS, JS, Gambar)
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Supabase
const supabaseUrl = 'https://tfowaintvaowjazaikvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmb3dhaW50dmFvd2phemFpa3ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzk2NjA5OSwiZXhwIjoyMDQ5NTQyMDk5fQ.bxcF493-4GnDGkHecIFhOzCE4NxgJYEJngO0ymIVb00';
const supabase = createClient(supabaseUrl, supabaseKey);

// Route untuk Halaman Login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});


// Route untuk Halaman Attend
app.get("/attend", (req, res) => {
  res.sendFile(path.join(__dirname, "public/attend.html"));
});

// Endpoint untuk menerima data dari form Attend
app.post('/attend', async (req, res) => {
  const { email, phoneNumber, seat, paymentMethod } = req.body;

  try {
    const { data, error } = await supabase
      .from('attend')
      .insert([{ email, phone_number: phoneNumber, seat, payment_method: paymentMethod }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Data berhasil disimpan', data });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
});

// Endpoint untuk menerima data form launch
app.post('/launch', async (req, res) => {
  const { eventName, theme, dateTime, attendeesLimit, location, price } = req.body;

  // Validasi input
  if (!eventName || !theme || !dateTime || !attendeesLimit || !location) {
      return res.status(400).json({ message: 'All fields are required except price.' });
  }

  try {
      // Simpan ke Supabase
      const { data, error } = await supabase.from('launch').insert([
          { eventName, theme, dateTime, attendeesLimit, location, price }
      ]);

      if (error) {
          console.error('Supabase Error:', error);
          return res.status(500).json({ message: 'Failed to save event data.' });
      }

      res.status(200).json({ message: 'Event launched successfully!', data });
  } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ message: 'An error occurred during event creation.' });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
