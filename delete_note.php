<?php
header('Content-Type: application/json');

// Include database connection
require_once 'db_connect.php';

// Enable error reporting for debugging
ini_set('log_errors', 1);
ini_set('error_log', 'error_log.log');




$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['id'])) {
    $id = intval($data['id']);

    $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ?");
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $pdo->errorInfo()]);
        exit();
    }

    $execute = $stmt->execute([$id]);

    if ($execute) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->errorInfo()]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
