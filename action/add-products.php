<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once '../connection/connection-db.php';

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

try {
    $email = htmlspecialchars($data['email'] ?? '');
    $role = htmlspecialchars($data['role'] ?? '');
    if (!$email || !$role) {
        throw new Exception("Email and role are required.", 400);
    }

    $sql = "SELECT * FROM users WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch();

    if (!$user || $user['role'] !== $role) {
        throw new Exception("Unauthorized user or role mismatch.", 403);
    }

    $userId = $user['id'];

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            handleCreate($conn, $data, $userId);
            break;

        case 'PUT':
            handleUpdate($conn, $data, $userId);
            break;

        case 'DELETE':
            handleDelete($conn, $data, $userId);
            break;

        default:
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed."]);
            break;
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    if ($conn) {
        $db->disconnect();
    }
}

function handleCreate($conn, $data, $userId)
{
    $name = htmlspecialchars($data['name'] ?? '');
    $description = htmlspecialchars($data['description'] ?? '');
    $price = filter_var($data['price'] ?? '', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $imagePath = htmlspecialchars($data['image_path'] ?? '') ?: "https://res.cloudinary.com/dlupbtvqe/image/upload/v1732512607/pzdhbdl1gju4kc8gbkub.jpg";

    if (!$name || !$description || !$price) {
        throw new Exception("All fields are required for product creation.", 400);
    }

    $sql = "INSERT INTO products (name, description, price, image_path, user_id) 
            VALUES (:name, :description, :price, :image_path, :user_id)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':image_path', $imagePath);
    $stmt->bindParam(':user_id', $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "The product has been created successfully."]);
    } else {
        throw new Exception("Failed to insert product.", 500);
    }
}

function handleUpdate($conn, $data, $userId)
{
    $productId = htmlspecialchars($data['id'] ?? '');
    $name = htmlspecialchars($data['name'] ?? '');
    $description = htmlspecialchars($data['description'] ?? '');
    $price = filter_var($data['price'] ?? '', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $imagePath = htmlspecialchars($data['image_path'] ?? '') ?: "https://res.cloudinary.com/dlupbtvqe/image/upload/v1732092630/if6usm1ywy9eqprjjfbv.jpg";

    if (!$productId || !$name || !$description || !$price) {
        throw new Exception("All fields are required for product update.", 400);
    }

    $sql = "UPDATE products 
            SET name = :name, description = :description, price = :price, image_path = :image_path 
            WHERE id = :id AND user_id = :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':image_path', $imagePath);
    $stmt->bindParam(':id', $productId);
    $stmt->bindParam(':user_id', $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "The product has been updated successfully."]);
    } else {
        throw new Exception("Failed to update the product.", 500);
    }
}

function handleDelete($conn, $data, $userId)
{
    $productId = htmlspecialchars($data['id'] ?? '');
    if (!$productId) {
        throw new Exception("Product ID is required for deletion.", 400);
    }

    $sql = "DELETE FROM products WHERE id = :id AND user_id = :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $productId);
    $stmt->bindParam(':user_id', $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "The product has been deleted successfully."]);
    } else {
        throw new Exception("Failed to delete the product.", 500);
    }
}