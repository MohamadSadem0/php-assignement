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

try {
  $stmt = $conn->prepare("SELECT id, name, description, price, image_path FROM products");
  $stmt->execute();
  $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
  if($products) {
    echo json_encode(["success" => true, "products" => $products]);
  } else {
    echo json_encode(["success" => false, "error" => "No products found"]);
  }
}catch (PDOException $e) {
  error_log("Database error: " . $e->getMessage());
  echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
} finally {
  $db->disconnect();
}
?>