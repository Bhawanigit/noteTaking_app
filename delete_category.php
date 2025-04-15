<?php
require_once 'functions.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $category = $data['category'] ?? '';

    if (!empty($category)) {
        $result = deleteCategory($category);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete category'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Category name is required'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>
