package com.fastnotes.app

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.fastnotes.app.ui.screens.HomeScreen
import com.fastnotes.app.ui.screens.NewNoteScreen
import com.fastnotes.app.ui.screens.NoteDetailScreen

@Composable
fun Navigation(viewModel: NoteViewModel) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                viewModel = viewModel,
                onNoteClick = { note -> navController.navigate("detail/${note.id}") },
                onNewNote = { navController.navigate("new") }
            )
        }
        composable("new") {
            NewNoteScreen(
                viewModel = viewModel,
                onNoteSaved = { navController.popBackStack() }
            )
        }
        composable(
            route = "detail/{noteId}",
            arguments = listOf(navArgument("noteId") { type = NavType.IntType })
        ) { backStackEntry ->
            val noteId = backStackEntry.arguments?.getInt("noteId")
            NoteDetailScreen(
                viewModel = viewModel,
                noteId = noteId,
                onBack = { navController.popBackStack() }
            )
        }
    }
}