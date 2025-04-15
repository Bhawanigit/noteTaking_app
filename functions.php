<?php
require_once 'db_connect.php';
if (ob_get_level()) ob_end_clean();

function getNotes() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM notes ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Error fetching notes: " . $e->getMessage());
        return false;
    }
}

function addNote($title, $content, $category, $color) {
    global $pdo;
    try {
        $pdo->beginTransaction();
        $sql = "INSERT INTO notes (title, content, category, color) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([$title, $content, $category, $color]);
        
        if ($result) {
            $id = $pdo->lastInsertId();
            $pdo->commit();
            return [
                'success' => true,
                'note' => [
                    'id' => $id,
                    'title' => $title,
                    'content' => $content,
                    'category' => $category,
                    'color' => $color
                ],
                'message' => 'Note added successfully'
            ];
        } else {
            $pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Failed to add note'
            ];
        }
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Error adding note: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Database error occurred'
        ];
    }
}

function editNote($id, $title, $content, $category) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?");
        return $stmt->execute([$title, $content, $category, $id]);
    } catch (PDOException $e) {
        error_log("Error editing note: " . $e->getMessage());
        return false;
    }
}

function deleteNote($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ?");
        return $stmt->execute([$id]);
    } catch (PDOException $e) {
        error_log("Error deleting note: " . $e->getMessage());
        return false;
    }
}

function getColors() {
    return ['#b2a48a', '#d1c8b8','#b7b9a3','#f3efe6', '#FFB3BA', '#BAFFC9', '#FFFFBA'];
}

function addCategory($category) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO notetaking_categories (Category) VALUES (?)");
        return $stmt->execute([$category]);
    } catch (PDOException $e) {
        error_log("Error adding category: " . $e->getMessage());
        return false;
    }
}


function getCategories() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT category FROM notetaking_categories ORDER BY category");
        $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
        return [
            'success' => true,
            'categories' => $categories
        ];
    } catch (PDOException $e) {
        error_log("Database error in getCategories(): " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ];
    }
}
function deleteCategory($category) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM notetaking_categories WHERE category = ?");
        return $stmt->execute([$category]);
    } catch (PDOException $e) {
        error_log("Error deleting category: " . $e->getMessage());
        return false;
    }
}

function editCategory($oldCategory, $newCategory) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("UPDATE notetaking_categories SET category = ? WHERE category = ?");
        return $stmt->execute([$newCategory, $oldCategory]);
    } catch (PDOException $e) {
        error_log("Error editing category: " . $e->getMessage());
        return false;
    }
}

?>