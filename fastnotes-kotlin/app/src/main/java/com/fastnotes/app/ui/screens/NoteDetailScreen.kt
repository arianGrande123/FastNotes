package com.fastnotes.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fastnotes.app.NoteViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteDetailScreen(
    viewModel: NoteViewModel,
    noteId: Int?,
    onBack: () -> Unit
) {
    val notes by viewModel.notes.collectAsState()
    val note = notes.find { it.id == noteId }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(note?.title ?: "Notat") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Tilbake")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            if (note != null) {
                Text(
                    text = note.title,
                    style = MaterialTheme.typography.headlineMedium
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = note.content,
                    style = MaterialTheme.typography.bodyLarge
                )
            } else {
                Text("Notatet ble ikke funnet.")
            }
        }
    }
}