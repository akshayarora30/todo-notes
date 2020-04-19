console.log( 'notes.js is running' );

/**
 * @description notesModule instance exposes
 * the methods to add, delete, searc, edit note
 */
const notesModule = ( function() {
    
    // private variable containing references to the notes
    const notes = {
        indicesReferences: [],
        indicesMap: {}
    };

    /**
     * @description: generateSubNote method is used to create a note
     * with references for provsion child notes
     * @param { Object } payload contains value of the note
     */
    const generateSubNote = payload => {
        const { id, value } = payload
        return {
            id,
            value,
            indicesReferences: [],
            indicesMap: {}
        };
    };

    /**
     * @description addNote method is used to add new note
     * to its parent node
     * the default parent node is notessModule notes object
     * @param { Object } payload contains properties
     * @property { string } parentId which contains hierarchy of its parent
     * @property { string } value which has the value of the note to be added.
     */
    const addNote = payload => {
        const { parentId } = payload;
        const levels = void( 0 ) === parentId ? [] : parentId.split( '.' );
        const node = findNode( { levels, node: notes } );
        const length = node.indicesReferences.length;
        const uid = length > 0 ? parseInt( node.indicesReferences[ length - 1 ], 10 ) + 1 : 1;
        const noteId = levels.length > 0 ? [ ...levels, uid ].join( '.' ) : uid
        
        node.indicesReferences.push( uid );
        
        // add it to notesMap
        node.indicesMap[ uid ] = generateSubNote( { ...payload, id: noteId } );
        return {
            message: 'note Added successfully',
            id: noteId
        };
    }
    
    /**
     * @description edit method is used to add new note
     * to its parent node
     * the default parent node is notessModule notes object
     * @param { Object } payload contains properties
     * @property { string } id which contains id of the note
     * @property { string } value which has the value of the note to be updated.
     */
    const editNote = payload => {
        const { id, value } = payload;
        const levels = void( 0 ) === id ? [] : id.split( '.' );
        const node = findNode( { levels, node: notes } );
        if( node.hasOwnProperty( 'value' ) ) {
            node.value = value
            return {
                message: 'note updated successfully',
            };
        }

        return {
            'message': 'Something went wrong'
        }
    };
    
    /**
     * @description delete method is used to delete note
     * @param { Object } payload contains properties
     * @property { string } id which contains id of the note to be deleted
     */
    const deleteNote = payload => {
        const { id } = payload;

        const levels = void( 0 ) === id ? [] : id.split( '.' );
       
        const parentLevels = levels.slice( 0, -1 );
       
        const parentNode = findNode( { levels: parentLevels, node: notes } );
        
        // delete entry from indicesReferences
        const nodeId = parseInt( levels[ levels.length - 1 ], 10 );
        const nodeIdIndex = parentNode.indicesReferences.indexOf( nodeId );
        const deletedNote = parentNode.indicesReferences.splice( nodeIdIndex, 1 );
        
        // delete entry from indicesMap;
        delete parentNode.indicesMap[ nodeId ];
        
        return {
            message: 'Note deleted successfully',
            note: deletedNote
        };
    };
    
    /**
     * @description findNode method is used to findNode the node
     * @param { Object } payload contains properties
     * @property { Array } levels which contains list of levels to which node is at
     * @property { Object } node which contains reference of the node to be considered
     */
    const findNode = payload => {
        const { levels, node } = payload;
        if( levels.length === 0  ) {
            return node;
        }
        
        return findNode( { levels: levels.slice( 1 ), node: node.indicesMap[ levels[ 0 ] ] } );
    };

    /**
     * @description getNotes method returns the notes object
     */
    const getNotes = () => {
        return {
            notes: notes.indicesMap
        }
    };
    
    return {
        notes,
        getNotes,
        addNote,
        editNote,
        deleteNote,
        findNode
    }
} )();