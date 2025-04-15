<?php
header('Content-Type: application/json');

// Database connection settings
require_once 'db_connect.php';


// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'], $data['title'], $data['content'], $data['category'])) {
    $id = $data['id'];
    $title = $data['title'];
    $content = $data['content'];
    $category = $data['category'];

    // Prepare and execute the update query
    try {
        $stmt = $pdo->prepare("
            UPDATE notes
            SET title = :title, content = :content, category = :category
            WHERE id = :id
        ");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        $stmt->bindParam(':content', $content, PDO::PARAM_STR);
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Note updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update note']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
}
?>
