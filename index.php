<?php
require_once 'functions.php';
$notes = getNotes();
$colors = getColors();
$categories = getCategories(); // Add this line to fetch categories
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Note Taking App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>My Library</h1>

        <div class="search-container">
        <input type="text" id="searchInput" placeholder="Search notes...">
       
        <img id="searchButton" src="search.png" alt="Search">
    </div>

        <button id="newNoteBtn">New Note</button>
    </header>
    <div class="container">
        <div class="sidebar">
            <?php include 'sidebar.php'; ?>
        </div>
        <div class="main-content" id="notesContainer">
           <?php if ($notes): ?>
    <?php foreach ($notes as $note): ?>
        <div class="note-card" 
             style="background-color: <?php echo htmlspecialchars($note['color']); ?>" 
             data-id="<?php echo htmlspecialchars($note['id']); ?>" 
             data-category="<?php echo htmlspecialchars($note['category']); ?>"
             data-created-at="<?php echo htmlspecialchars(date('Y-m-d', strtotime($note['created_at']))); ?>">
            <h3><?php echo htmlspecialchars($note['title']); ?></h3>
            <p><?php echo htmlspecialchars(substr($note['content'], 0, 100)) . '...'; ?></p>
            <span class="category"><?php echo htmlspecialchars($note['category']); ?></span>
            <br/>    <br/>   <br/>    <br/>
            <button class="edit_note" data-id="<?php echo htmlspecialchars($note['id']); ?>">Edit Note</button>
            <button class="delete_note" data-id="<?php echo htmlspecialchars($note['id']); ?>">Delete Note</button>
        </div>
    <?php endforeach; ?>
<?php else: ?>
    <p>No notes found.</p>
<?php endif; ?>
        </div>
    </div>

    <!-- New Note Modal -->
    <div id="newNoteModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add New Note</h2>
            <form id="newNoteForm">
                <input type="text" id="noteTitle" name="title" placeholder="Title" required>
                <textarea id="noteContent" name="content" placeholder="Content" required></textarea>
                <select id="noteCategory" name="category" required>
                    <option value="" disabled selected>Select Category</option>
                    <!-- Categories will be dynamically populated here -->
                </select>
                <button type="submit" id="addNoteBtn">Add Note</button>
            </form>
        </div>
    </div>

    <!-- Edit Note Modal -->
    <div id="editNoteModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Note</h2>
            <form id="editNoteForm">
                <input type="hidden" id="editNoteId" name="id">
                <input type="text" id="editNoteTitle" name="title" placeholder="Title" required>
                <textarea id="editNoteContent" name="content" placeholder="Content" required></textarea>
                <select id="editNoteCategory" name="category" required>
                    <option value="" disabled selected>Select Category</option>
                    <!-- Categories will be dynamically populated here -->
                </select>
                <button type="submit" id="editNoteBtn">Save Changes</button>
            </form>
        </div>
    </div>
   

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
