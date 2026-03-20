package com.fastnotes.app

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class NoteViewModel : ViewModel() {

    private val _notes = MutableStateFlow<List<Note>>(emptyList())
    val notes: StateFlow<List<Note>> = _notes

    private var nextId = 1

    fun addNote(title: String, content: String) {
        val newNote = Note(id = nextId++, title = title, content = content)
        _notes.value = _notes.value + newNote
    }
}