const { nanoid } = require('nanoid');
const notes = require('./notes');

//* menampilkan pesan pada localhost untuk pindah ke dalaman website yang disarankan
const setupNormal = (request, h) => {
    const { name = 'User' } = request.query;
    return h.response(`<p>Hallo, ${name} please visit the website <a href= "http://notesapp-v1.dicodingacademy.com/" target="_blank">http://notesapp-v1.dicodingacademy.com/</a> and change the url to http://localhost:8081</p>`)
        .code(201)
        .header('X-Powered-By', 'NodeJS')
        .type('text/html')
}


//! menambah note
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;


    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt,
    };

    notes.push(newNote);

    const success = notes.filter((note) => note.id === id).length > 0;

    // jika success = true
    if (success) {
        return h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId: id,
                },
            })
            .code(201)
            .message('Catatan berhasil di tambahkan!');
    }


    return h.response({
        status: 'Fail',
        message: 'Catatan gagal ditambahkan',
    }).
    code(500)
        .message('Catatan gagal ditambahkan');
}


// ! Menampilkan catatan
const getAllNotesHandler = () => ({
    status: 'Success',
    data: {
        notes,
    },
})

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'Success',
            data: {
                note,
            },
        }
    }

    return h.response({
            status: 'Fail',
            message: 'Catatan tidak ditemukan',
        })
        .code(404)
        .message('Catatan tidak ditemukan')
}



//! mengubah note
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((n) => n.id === id); //true = 1, false = -1

    // jika index yang mau di ubah ditemukan
    if (index !== -1) {
        notes[index] = {...notes[index], title, tags, body, updatedAt }; //di gunakan untuk mempertahankan nilai index notes[index]

        return h.response({
                status: 'Success',
                message: 'Catatan berhasil diperbarui'
            })
            .code(200)
            .message('Catatan berhasil diperbarui!');
    }

    // jika tidak
    return h.response({
            status: 'Fail',
            message: 'Catatan gagal diperbarui, id tidak ditemukan!'
        })
        .code(404)
        .message('Catatan gagal diperbarui, id tidak ditemukan!');
}




// ! Hapus catatan
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((n) => n.id === id);

    // bila iya
    if (index !== -1) {
        notes.splice(index, 1); //hapus mulai dari index ke index 1
        return h.response({
                status: 'Success',
                message: 'Catatan berhasil dihapus!',
            })
            .code(200)
            .message('Catatan berhasil dihapus!');
    }

    // bila tidak
    return h.response({
            status: 'Fail',
            message: 'Catatan gagal dihapus, id tidak ditemukan!',
        })
        .code(404)
        .message('Catatan gagal dihapus, id tidak ditemukan!');
}
module.exports = { setupNormal, addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };