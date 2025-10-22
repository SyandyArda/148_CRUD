const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${PORT}`);
})

const db = mysql.createPool({
    host: 'localhost',
    port: 3309,
    user: 'root',
    password: 'Arsyan290105', // Sesuaikan dengan password Anda
    database: 'mahasiswa'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:' + err.stack);
        return;
    }
    console.log('Connected Succesfully');
});

app.get('/mahasiswa', (req, res) => {
    db.query('SELECT *from biodata', (err, results) => {
        if (err) {
            console.error("Error executing query:", err.stack);
            res.status(500).send('Error fetching mahasiswa');
        return;
        }

        res.json({ message: "Data berhasil diambil", data: results });
    });
});

app.post('/mahasiswa', (req, res) => {
    const {nama, alamat, agama} = req.body;

    if(!nama || !alamat || !agama) {
        return.res.status(400).json({message: "Nama, alamat, dan agama harus diisi!."});
    }

    db.query(
        "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
        [nama, alamat, agama],
        (err, results) => {
            if (err) {
                console.error(err);
                return.res.status(500).json({ message: "Database Error"});
            }
            res.status(201).json({message: "User Created Succesfully"});
        }
    );
}
);

app.delete('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM biodata WHERE id = ?', [userId], (err, results) => {
        if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error"});
            }
            res.json({message: "User Deleted Succesfully"});
    });
}