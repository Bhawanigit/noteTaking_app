<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

if (isset($data['id'], $data['title'], $data['content'], $data['category'])) {
    $id = intval($data['id']);
    $title = htmlspecialchars($data['title']);
    $content = htmlspecialchars($data['content']);
    $category = htmlspecialchars($data['category']);

    try {
        $stmt = $pdo->prepare("UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?");
        $stmt->execute([$title, $content, $category, $id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database query error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
