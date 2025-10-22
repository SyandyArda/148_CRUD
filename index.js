const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3001; // Port untuk server Express Anda

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createPool({
    host: 'localhost',
     port: 3309,
    user: 'root',
    password: 'Arsyan290105', // Sesuaikan dengan password Anda
    database: 'mahasiswa'
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Gagal terhubung ke database pool:', err.stack);
        return;
    }
    console.log('Berhasil terhubung ke database pool.');
    connection.release(); // Kembalikan koneksi
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get('/mahasiswa', (req, res) => {
    db.query('SELECT * from biodata', (err, results) => {
        if (err) {
            console.error("Error executing query:", err.stack);
            res.status(500).send('Error fetching mahasiswa');
            return;
        }
        res.json(results);
    });
});

app.post('/mahasiswa', (req, res) => {
    const { nama, alamat, agama } = req.body;

    if (!nama || !alamat || !agama) {
        return res.status(400).json({ message: "Nama, alamat, dan agama harus diisi!." });
    }

    db.query(
        "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
        [nama, alamat, agama],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error" });
            }
            res.status(201).json({ message: "User Created Succesfully" });
        }
    );
});

app.put('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, alamat, agama } = req.body;
    
    db.query(
        "UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id= ?",
        [nama, alamat, agama, userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error" });
            }
            res.json({ message: "User Updated Succesfully" });
        }
    );
});

app.delete('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM biodata WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database Error" });
        }
        res.json({ message: "User Deleted Succesfully" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});