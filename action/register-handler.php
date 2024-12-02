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

if ($conn) {
    error_log("Database connection established.");
} else {
    error_log("Failed to connect to the database.");
    echo json_encode(["error" => "Database connection failed."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['password'], $data['email'])) {
    echo json_encode(["error" => "Invalid input. 'name', 'password', and 'email' are required."]);
    error_log("Input validation failed. Missing required fields.");
    exit();
}

$name = htmlspecialchars($data['name'] ?? '');
$password = htmlspecialchars($data['password'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');
$imagePath = htmlspecialchars($data['image_path'] ?? '');
$date = date("Y-m-d H:i:s");
$role = "user";

// Admin details
$adminName = "helmi";
$adminPassword = "adminnooneknow";
$adminHashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);
$adminEmail = "admin@gmail.com";
$adminRole = "admin";

try {
    $query = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role = :role");
    $query->bindParam(':role', $adminRole);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result['count'] == 0) {
        $sql = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $adminName);
        $stmt->bindParam(':email', $adminEmail);
        $stmt->bindParam(':password', $adminHashedPassword);
        $stmt->bindParam(':role', $adminRole);
        if ($stmt->execute()) {
            error_log("Admin account created successfully.");
        } else {
            error_log("Failed to create admin account.");
        }
    } else {
        error_log("Admin account already exists.");
    }
} catch (PDOException $e) {
    error_log("Database error during admin role check: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "An error occurred while saving your data."]);
    exit();
}

if ($role === 'admin') {
    echo json_encode(["success" => false, "error" => "Admin user cannot register."]);
    error_log("Attempt to register as admin blocked.");
    exit();
}

$sql = "SELECT * FROM users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);

try {
    $stmt->execute();
} catch (PDOException $e) {
    error_log("Error executing email check: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Database error occurred while checking email."]);
    exit();
}

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "error" => "Email is already registered. Please use a different email."]);
    error_log("Email $email already exists in the database.");
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
error_log("Password hashed successfully.");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $sql = "INSERT INTO users (name, password, email, date, role, image_path) VALUES (:name, :password, :email, :date, :role, :image_path)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':image_path', $imagePath);

        error_log("Executing SQL query to insert regular user data.");
        error_log("Data - Name: $name, Email: $email, Role: $role, Image Path: $imagePath");

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Thank you, $name. Your information has been recorded."]);
            error_log("Regular user data insertion successful.");
        } else {
            echo json_encode(["success" => false, "error" => "Failed to insert data. Please try again."]);
            error_log("Regular user data insertion failed.");
        }
    } catch (PDOException $e) {
        error_log("Database error during user data insertion: " . $e->getMessage());
        echo json_encode(["success" => false, "error" => "An error occurred while saving your data."]);
    } finally {
      $db->disconnect();
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}
?>