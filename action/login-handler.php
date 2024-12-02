<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once '../connection/connection-db.php';

$db = new Database();
$conn = $db->getConnection();

error_log("Login Session ID: " . session_id());
error_log("Login user_id: " . ($_SESSION['user_id'] ?? "Not set"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    try {
        $stmt = $conn->prepare("SELECT id, password,email,role FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch();
        
        error_log(print_r($user, true));
        if ($user) {
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                error_log("Session user_id after login: " . $_SESSION['user_id']); // Debug
                echo json_encode(["success" => true, "message" => "Login successful", "email" => $user['email'], "role"=>$user['role']]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid username or password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "An error occurred", "error" => $e->getMessage()]);
    } finally {
      $db->disconnect();
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
}
?>