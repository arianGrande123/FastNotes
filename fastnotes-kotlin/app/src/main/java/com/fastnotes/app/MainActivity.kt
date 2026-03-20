package com.fastnotes.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.fastnotes.app.ui.theme.FastNotesTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FastNotesTheme {
                val noteViewModel: NoteViewModel = viewModel()
                Navigation(viewModel = noteViewModel)
            }
        }
    }
}