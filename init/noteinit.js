const Note = require('../server/models/Notes');
const mongoose = require('mongoose');

// _______________ Connect to DB_________________________
mongoose.connect('mongodb://127.0.0.1/notes_local')
    .then(() => console.log("Connected successfully to DB (init)..."))
    .catch((err) => console.log(err));
//______________________________________________________
const notes = [
    new Note({
        title: "Twelvth note",
        body: "This is my Twelvth note about policy"
    }),
    new Note({
        title: "thiteenth note",
        body: "This is my thiteenth note about history"
    }),
    new Note({
        title: "Fortennth note",
        body: "This is my Fortennth note about Islam"
    }),
    new Note({
        title: "Fifteenth note",
        body: "This is my Fifteenth note about computer"
    }),
    new Note({
        title: "sixteenth note",
        body: "This is my sixteenth note about cemical"
    })
]

var num = 0;
for (var i = 0; i < notes.length; i++) {
    notes[i].save()
        .then((result) => {
            // console.log("pppppppppppppppppppppppppppppppppppppp: ", num);
            // console.log(result);
            num++;
            if (num == notes.length) {
                mongoose.disconnect();
            }
        })
        .catch((err) => {
            console.log(err)
        })

}