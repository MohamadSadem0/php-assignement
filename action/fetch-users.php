<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

error_log("Session ID: " . session_id());
error_log("Session user_id: " . ($_SESSION['user_id'] ?? "Not set"));

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit;
}

require_once '../connection/connection-db.php';

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("SELECT id, name, email, password, date, role, image_path FROM users WHERE id = :id");
    $stmt->bindParam(':id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log("Fetched user: " . json_encode($user));
    
    if ($user) {
        echo json_encode(["success" => true, "data" => $user]);
    } else {
        echo json_encode(["success" => false, "error" => "User not found."]);
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
} finally {
    $db->disconnect();
}
?>