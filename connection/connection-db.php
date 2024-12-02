<?php
class Database {
    private $host;
    private $db;
    private $user;
    private $pass;
    private $conn;

    public function __construct() {
        $this->host = 'localhost:3307';
        $this->db = 'store_db';
        $this->user = 'root';
        $this->pass = '123';

        $dsn = "mysql:host={$this->host};dbname={$this->db};charset=utf8mb4";
        try {
            $this->conn = new PDO($dsn, $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode(["error" => "Connection failed: " . $e->getMessage()]));
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function disconnect() {
        $this->conn = null;
    }
}