<?php
require_once '../connection/connection-db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    try {
        // Check if email exists
        $stmt = $conn->prepare("SELECT COUNT(email) AS email_count FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['email_count'] > 0) {
            $stmt1 = $conn->prepare("SELECT password FROM users WHERE email = :email");
            $stmt1->bindParam(':email', $email);
            $stmt1->execute();
            $db_password = $stmt1->fetch(PDO::FETCH_ASSOC)['password'];

            // Hash the new password
            $new_password = password_hash($password, PASSWORD_DEFAULT);

            // Verify if the new password matches the existing one
            if (password_verify($password, $db_password)) {
                echo json_encode(["success" => false, "message" => "Password not changed"]);
            } else {
                // Update the password if it doesn't match
                $stmt2 = $conn->prepare("UPDATE users SET password = :password WHERE email = :email");
                $stmt2->bindParam(':password', $new_password);
                $stmt2->bindParam(':email', $email);
                $stmt2->execute();
                echo json_encode(["success" => true, "message" => "Password changed successfully"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Email not found"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "An error occurred",
            "error" => $e->getMessage()
        ]);
    } finally {
      $db->disconnect();
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
}
?>