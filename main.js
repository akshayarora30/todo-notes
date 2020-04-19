console.log( 'main.js is running' );

const notesForm = document.querySelector( '#form-notes' );
const notesList = document.querySelector( '.notes-list' );

const createChild = payload => {
    const { node, childData } = payload;
}

notesForm.addEventListener( 'submit', ( evt ) => {
    evt.preventDefault();

} )